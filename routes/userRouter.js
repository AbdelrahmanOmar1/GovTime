const express  =  require('express');
const router = express.Router();
const userController =  require ('../controllers/userController');
const authController = require ('../controllers/authController');   


// signin route
router.post('/signin', authController.signin);
router.post('/login' , authController.login);    

// user routes and protections
router.get('/' ,userController.getAllUsers);
router.post('/', userController.createUser);
router.patch('/:id', userController.updateUser);
router.get('/:id',userController.getUserById);
router.delete('/:id' ,userController.deleteUser);



module.exports = router;