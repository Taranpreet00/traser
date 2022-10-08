const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts_controller');
router.get('/', postsController.post);

module.exports = router;