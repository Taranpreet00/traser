const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users_controller');
router.get('/profile', usersController.profile);
router.get('/signup', usersController.signup);
router.get('/signin', usersController.signin);
router.post('/signin/create-session', usersController.createSession);
router.post('/signup/create', usersController.create);


module.exports = router;