const router  = require('express').Router();
const ctrl    = require('../controllers/hotelController');
const auth    = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/search',            ctrl.searchHotels);
router.get('/',                  ctrl.getAllHotels);
router.get('/:id',               ctrl.getHotelById);
router.post('/',                 auth, isAdmin, ctrl.createHotel);
router.put('/:id',               auth, isAdmin, ctrl.updateHotel);
router.delete('/:id',            auth, isAdmin, ctrl.deleteHotel);
router.post('/:id/rooms',        auth, isAdmin, ctrl.addRoom);
router.put('/rooms/:room_id',    auth, isAdmin, ctrl.updateRoom);
router.delete('/rooms/:room_id', auth, isAdmin, ctrl.deleteRoom);

module.exports = router;