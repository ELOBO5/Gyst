const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const habitsController = require("../controllers/habits.js");

router.get("/", verifyToken, habitsController.index);
router.get("/:id", verifyToken, habitsController.show);
router.post("/", verifyToken, habitsController.create);
router.put('/:id', verifyToken, habitsController.update);
router.delete("/:id", verifyToken, habitsController.destroy);

module.exports = router;
