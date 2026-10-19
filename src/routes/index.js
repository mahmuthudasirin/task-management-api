const { Router } = require("express");
const employeeRoutes = require("./employee.routes");
const projectRoutes = require("./project.routes");
const taskRoutes = require("./task.routes");
const reportRoutes = require("./report.routes");

const router = Router();

router.use("/employees", employeeRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/reports", reportRoutes);

module.exports = router;
