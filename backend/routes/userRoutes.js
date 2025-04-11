const express = require('express');
const router = express.Router();
const { createUser, getAllUsers } = require('../controllers/userController');

router.post('/', createUser);        // POST /api/users
router.get('/', getAllUsers);        // GET /api/users

module.exports = router;
