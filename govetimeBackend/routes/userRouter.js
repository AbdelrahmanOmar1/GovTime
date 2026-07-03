const express  =  require('express');
const router = express.Router();
const userController =  require ('../controllers/userController');
const authController = require ('../controllers/authController');   



// user routes and protections
router.get('/' ,authController.protect , authController.restrictTo('admin'),userController.getAllUsers);
router.post('/', authController.protect ,authController.restrictTo('admin'),userController.createUser);
router.get('/:id', authController.protect, authController.restrictTo('admin' , 'user' , 'officer'),userController.getUserById);
router.patch('/:id', authController.protect,authController.restrictTo('admin' , 'user' , 'officer') , userController.updateUser);
router.delete('/:id' , authController.protect, authController.restrictTo('admin'),userController.deleteUser);


module.exports = router;