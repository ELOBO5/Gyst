const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const habitsController = require("../controllers/habits.js");

router.get("/", habitsController.index);
router.get("/:id", habitsController.show);
router.post("/", habitsController.create);
router.put("/:id/info", habitsController.updateInfo);
router.put("/:id/completed", habitsController.toggleCompleted);
router.put("/:id/reset", habitsController.dailyReset);
router.delete("/:id", habitsController.destroy);

module.exports = router;
