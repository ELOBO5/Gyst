const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const habitsController = require("../controllers/habits.js");

router.get("/", habitsController.index);
router.get("/:id", habitsController.show);
router.post("/", habitsController.create);
router.patch("/:id/info", habitsController.updateInfo);
router.patch("/:id/completed", habitsController.toggleCompleted);
router.patch("/:id/reset", habitsController.dailyReset);
router.delete("/:id", habitsController.destroy);

module.exports = router;
