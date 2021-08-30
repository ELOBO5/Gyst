const router = require('express').Router();

const habitsController = require('../controllers/habits.js');

router.get('/', habitsController.index);
router.get('/:id', habitsController.show);
router.post('/', habitsController.create);
router.delete('/:id', habitsController.destroy);

module.exports = router;
