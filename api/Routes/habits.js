const router = require("express").Router();

const habitsController = require("../controllers/habits.js");

const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, habitsController.index);
router.get("/:id", verifyToken, habitsController.show);
router.post("/", verifyToken, habitsController.create);
router.delete("/:id", verifyToken, habitsController.destroy);

module.exports = router;
