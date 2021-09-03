const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const habitsController = require("../controllers/habits.js");

router.get("/", verifyToken, habitsController.index);
router.get("/:id", verifyToken, habitsController.show);
router.post("/", verifyToken, habitsController.create);
router.patch("/:id/info", verifyToken, habitsController.updateInfo);
router.patch("/:id/completed", verifyToken, habitsController.toggleCompleted);
router.patch("/:id/reset", verifyToken, habitsController.dailyReset);
router.delete("/:id", verifyToken, habitsController.destroy);

module.exports = router;
