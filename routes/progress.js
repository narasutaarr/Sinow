const express = require('express');
const router = express.Router();
const c = require('../controllers/progressController');
const auth = require('../middleware/auth');

router.get('/', auth, c.getMyProgress);
router.post('/', auth, c.saveProgress);

module.exports = router;