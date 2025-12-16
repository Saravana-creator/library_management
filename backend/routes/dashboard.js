const express = require('express');
const { getDashboardStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const roleAuth = require('../middleware/roleAuth');

const router = express.Router();

router.get('/stats', auth, roleAuth('librarian'), getDashboardStats);

module.exports = router;
