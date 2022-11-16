const express = require('express');
const router = express.Router();
const passport = require('passport');

const likesController = require('../controllers/like_controller');

router.post('/comment/:id', passport.checkAuthentication, likesController.commentLike);
router.post('/post/:id', passport.checkAuthentication, likesController.postLike);

module.exports = router;