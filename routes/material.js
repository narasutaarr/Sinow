const express = require('express');
const router = express.Router();
const c = require('../controllers/materialController');
const auth = require('../middleware/auth');

router.get('/', c.getAll);
router.get('/:id', c.getById);
router.post('/', auth, c.create);
router.put('/:id', auth, c.update);
router.delete('/:id', auth, c.remove);

module.exports = router;