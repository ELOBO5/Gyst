const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const habitsController = require("../controllers/habits.js");

router.get("/", verifyToken, habitsController.index);
router.get("/:id", verifyToken, habitsController.show);
router.post("/", verifyToken, habitsController.create);
router.put("/:id/info", verifyToken, habitsController.updateInfo);
router.put("/:id/completed", verifyToken, habitsController.toggleCompleted);
router.put("/:id/reset", verifyToken, habitsController.dailyReset);
router.delete("/:id", verifyToken, habitsController.destroy);

module.exports = router;
