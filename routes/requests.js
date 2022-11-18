const express = require('express');
const router = express.Router();
const passport = require('passport');

const requestController = require('../controllers/requests_controller');
router.get('/fetch',passport.checkAuthentication , requestController.fetchRequests);
router.get('/new_request/:id', passport.checkAuthentication, requestController.newRequest);
router.get('/confirm-request/:id', passport.checkAuthentication, requestController.confirmRequest);
router.get('/destroy/:id', passport.checkAuthentication, requestController.destroyRequest);
router.get('/remove-friend/:id', passport.checkAuthentication, requestController.removeFriend);
router.get('/cancel-request/:id', passport.checkAuthentication, requestController.cancelRequest);

module.exports = router;