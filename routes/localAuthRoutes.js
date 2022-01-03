const { Router } = require('express');

const localAuthControllers = require('../controllers/localAuthControllers');

const router = Router();

router.post('/signup', localAuthControllers.post_local_signup);
router.post('/signin', localAuthControllers.post_local_signin);

module.exports = router;
