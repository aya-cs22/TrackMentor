const transporter = require('../config/mailConfig'); 
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto'); // To generate verification code

const EMAIL_VERIFICATION_TIMEOUT = 60 * 60 * 1000; // 60 minutes in milliseconds

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log('Request Body:', req.body); 
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const role = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';
    // console.log('Plain Password:', password); 
    const newUser = new User({
      name,
      email,
      password,
      isVerified: false,
      role,
      emailVerificationCode: crypto.randomBytes(32).toString('hex'), // Generate verification code
      verificationCodeExpiry: new Date(Date.now() + EMAIL_VERIFICATION_TIMEOUT)
    });
    await newUser.save();
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: 'Email Verification',
      text: `Your verification code is: ${newUser.emailVerificationCode}`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Registration successful, please verify your email' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    // console.log('Received Data:', { email, code });
    if (!email || !code) {
      return res.status(400).json({ message: 'Email and verification code are required' });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    if (!user.emailVerificationCode || user.emailVerificationCode !== code || new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }
    user.isVerified = true;
    user.emailVerificationCode = null;
    user.verificationCodeExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    // console.log('Entered Password:', password);
    // console.log('Stored Password:', user.password); 
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.status(200).json({
      message: 'Login successful',
      token,  // Token 
      user: {
        id: user._id,
        name: user.name,  
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
      name,
      email,
      password, 
      role, 
      isVerified: true, 
    });

    await newUser.save();
    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    let userResponse;
    
    if (req.user.role === 'admin') {
      userResponse = { ...user._doc, password: undefined };
    } else if (req.user.id === id) {
      userResponse = { ...user._doc };
    }

    res.status(200).json(userResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const users = await User.find().select('-password'); 
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const updates = {};
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.id === id) {
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (req.body.password) updates.password = req.body.password; 
      if (role) {
        return res.status(403).json({ message: 'You cannot change your role' });
      }
    }
    if (req.user.role === 'admin') {
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (role) updates.role = role;
      if (req.body.password) {
        return res.status(403).json({ message: 'Admin cannot change user password' });
      }
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Verify that the user performing the delet is the same as the specified user or an admin.
    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User successfully deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
