const { asyncHandler } = require("../utils/asyncHandler");
const reportService = require("../services/report.service");

const getSummary = asyncHandler(async (req, res) => {
  res.json({ success: true, data: reportService.getSummary() });
});

const getTasksByStatus = asyncHandler(async (req, res) => {
  res.json({ success: true, data: reportService.getTasksByStatus() });
});

const getTasksByEmployee = asyncHandler(async (req, res) => {
  res.json({ success: true, data: reportService.getTasksByEmployee() });
});

const getOverdueTasks = asyncHandler(async (req, res) => {
  const tasks = reportService.getOverdueTasks();
  res.json({ success: true, count: tasks.length, data: tasks });
});

const getProjectProgress = asyncHandler(async (req, res) => {
  const data = reportService.getProjectProgress(req.params.projectId);
  res.json({ success: true, data });
});

module.exports = {
  getSummary,
  getTasksByStatus,
  getTasksByEmployee,
  getOverdueTasks,
  getProjectProgress,
};
