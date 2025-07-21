const express = require('express');
const router = express.Router();
import userController from '../controllers/userController';

router.get('/', userController.getAllUsers);
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);
router.get('/id/:id', userController.getUserById);
router.get('/:username', userController.getUserByUsername);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
