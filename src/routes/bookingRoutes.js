const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');
const {
  createBookingRequest,
  getAllBookingRequests,
  managerAction,
  adminAction
} = require('../controllers/bookingController');

router.post('/', authenticateToken, authorize([ROLES.EMPLOYEE]), createBookingRequest);
router.get('/', authenticateToken, getAllBookingRequests);
router.put('/:id/manager-action', authenticateToken, authorize([ROLES.TEAM_MANAGER]), managerAction);
router.put('/:id/admin-action', authenticateToken, authorize([ROLES.ADMIN]), adminAction);

module.exports = router;
