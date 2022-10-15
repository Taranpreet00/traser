const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
router.get('/profile',passport.checkAuthentication ,usersController.profile);
router.get('/signup', usersController.signup);
router.get('/signin', usersController.signin);
//use passport as a middleware to authenticate
router.post('/signin/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'}
),usersController.createSession);
router.post('/signup/create', usersController.create);
router.get('/signout', usersController.destroySession);


module.exports = router;