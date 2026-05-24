const router  = require('express').Router();
const ctrl    = require('../controllers/adminController');
const auth    = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/users',      auth, isAdmin, ctrl.getAllUsers);
router.get('/bookings',   auth, isAdmin, ctrl.getAllBookings);
router.get('/dashboard',  auth, isAdmin, ctrl.getDashboardStats);

module.exports = router;