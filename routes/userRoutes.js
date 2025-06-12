const express = require('express');
const UserController = require('../controller/userController');
const { authenticateSession } = require('../middleware/auth');

const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', authenticateSession, UserController.logout);

module.exports = router;