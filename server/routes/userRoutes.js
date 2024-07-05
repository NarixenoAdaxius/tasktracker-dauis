const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logout } = require('../controllers/userController');
const auth = require('../utils/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', auth, logout);

module.exports = router;