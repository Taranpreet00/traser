const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller');
router.get('/profile', usersController.profile);
router.get('/signup', usersController.signup);
router.get('/signin', usersController.signin);
router.post('/signin/create-session', usersController.submitSignin);
router.post('/signup/create', usersController.submitSignup);


module.exports = router;