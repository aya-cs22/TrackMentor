const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');

router.post('/register', userController.register);
router.post('/verify-email', userController.verifyEmail);
router.post('/login', userController.login);
router.post('/add', authenticate, userController.addUser);

router.get('/:id', authenticate, userController.getUser);
router.get('/', authenticate, userController.getAllUsers);

router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;