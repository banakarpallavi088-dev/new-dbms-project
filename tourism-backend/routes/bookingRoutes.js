const router = require('express').Router();
const ctrl   = require('../controllers/bookingController');
const auth   = require('../middleware/auth');

router.post('/package',              auth, ctrl.bookPackage);
router.post('/hotel',                auth, ctrl.bookHotel);
router.get ('/my',                   auth, ctrl.getMyBookings);
router.put ('/package/:id/cancel',   auth, ctrl.cancelPackageBooking);

module.exports = router;