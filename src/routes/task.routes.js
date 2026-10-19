const { Router } = require("express");
const taskController = require("../controllers/task.controller");

const router = Router();

router.get("/", taskController.getTasks);
router.get("/:id", taskController.getTaskById);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.patch("/:id/status", taskController.updateTaskStatus);
router.patch("/:id/assign", taskController.assignTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;
