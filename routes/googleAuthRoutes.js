const { Router } = require('express');

const googleAuthControllers = require('../controllers/googleAuthControllers');

const router = Router();

router.post('/', googleAuthControllers.post_auth_google);

module.exports = router;
