const express = require('express');
const router = express.Router();
const passport = require('passport');

const chatcontroller = require('../controllers/chat_controller');

router.get('/fetch', passport.checkAuthentication, chatcontroller.fetch);
router.post('/getchat', passport.checkAuthentication, chatcontroller.fetchChat);
router.post('/send_message', passport.checkAuthentication, chatcontroller.newMessage);
router.get('/delete_message/:id', passport.checkAuthentication, chatcontroller.deleteMessage);


module.exports = router;