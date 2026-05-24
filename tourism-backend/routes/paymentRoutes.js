const router = require('express').Router();
const ctrl   = require('../controllers/paymentController');
const auth   = require('../middleware/auth');

router.post('/',   auth, ctrl.createPayment);
router.get('/my',  auth, ctrl.getMyPayments);

module.exports = router;