const { Router } = require("express");
const reportController = require("../controllers/report.controller");

const router = Router();

router.get("/summary", reportController.getSummary);
router.get("/tasks-by-status", reportController.getTasksByStatus);
router.get("/tasks-by-employee", reportController.getTasksByEmployee);
router.get("/overdue-tasks", reportController.getOverdueTasks);
router.get("/projects/:projectId/progress", reportController.getProjectProgress);

module.exports = router;
