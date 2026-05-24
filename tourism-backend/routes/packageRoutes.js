const router  = require('express').Router();
const ctrl    = require('../controllers/packageController');
const auth    = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.get('/',        ctrl.getAllPackages);
router.get('/:id',     ctrl.getPackageById);
router.post('/',   auth, isAdmin, ctrl.createPackage);
router.put('/:id', auth, isAdmin, ctrl.updatePackage);
router.delete('/:id', auth, isAdmin, ctrl.deletePackage);

module.exports = router;