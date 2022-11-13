const express = require('express');
const router = express.Router();
const passport = require('passport');

const usersController = require('../controllers/users_controller');
router.get('/profile/:id',passport.checkAuthentication ,usersController.profile);
router.post('/update/:id', passport.checkAuthentication, usersController.update);
router.get('/signup', usersController.signup);
router.get('/signin', usersController.signin);
//use passport as a middleware to authenticate
router.post('/signin/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'}
),usersController.createSession);
router.post('/signup/create', usersController.create);
router.get('/signout', usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/signin'}), usersController.createSession);

//Forget password
router.get('/forgetpassword', usersController.forgetPassword);
router.post('/create-token', usersController.createToken);
router.get('/reset_password_page', usersController.resetPasswordPage);
router.post('/reset_password', usersController.resetPassword);

module.exports = router;