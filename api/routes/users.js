const router = require("express").Router();
const { verifyToken } = require("../middleware/auth");
const usersController = require("../controllers/user.js");

router.get("/", usersController.index);
router.get("/:id", usersController.show);
router.get("/:id/habits", verifyToken, usersController.getHabitsForUser)
router.post("/", usersController.create);
router.delete("/:id", usersController.destroy);

module.exports = router;
