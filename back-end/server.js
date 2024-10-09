const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config({ path: 'config.env' });

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://127.0.0.1:5500', 
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

const dbConnection = require("./config/db");
dbConnection();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/not-authorized', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'not-authorized.html'));
});

// Middlewares
if (process.env.NODE_ENV === "development") {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}

const userRoutes = require('./routes/userRoutes');
const trackRouter = require('./routes/trackRoutes');
const languageRoutes = require('./routes/languageRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const quizRoutes = require('./routes/quizRoutes');

function isAuthorized(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.redirect('/not-authorized');
    }
    const isAdmin = true;
    if (!isAdmin) {
        return res.redirect('/not-authorized');
    }
    next();
}

app.get('/admin', isAuthorized, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html')); 
});

app.use('/api/users', userRoutes);
app.use('/api/tracks', trackRouter);
app.use('/api/languages', languageRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/quizzes', quizRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
