const { asyncHandler } = require("../utils/asyncHandler");
const { HttpError } = require("../utils/httpError");
const { requireFields, validateTask } = require("../utils/validators");
const { TASK_STATUSES } = require("../config/constants");
const taskService = require("../services/task.service");

const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, assigneeId, projectId } = req.query;
  const tasks = taskService.listTasks({
    status,
    priority,
    assigneeId,
    projectId,
  });
  res.json({ success: true, count: tasks.length, data: tasks });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = taskService.findTaskById(req.params.id);
  if (!task) {
    throw new HttpError(404, "Görev bulunamadı");
  }
  res.json({ success: true, data: task });
});

const createTask = asyncHandler(async (req, res) => {
  validateTask(req.body);
  const task = taskService.createTask(req.body);
  res.status(201).json({ success: true, data: task });
});

const updateTask = asyncHandler(async (req, res) => {
  validateTask(req.body, { partial: true });
  const task = taskService.updateTask(req.params.id, req.body);
  res.json({ success: true, data: task });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  requireFields(req.body, ["status"]);
  if (!TASK_STATUSES.includes(req.body.status)) {
    throw new HttpError(400, "Geçersiz durum", { allowed: TASK_STATUSES });
  }
  const task = taskService.updateTaskStatus(req.params.id, req.body.status);
  res.json({ success: true, data: task });
});

const assignTask = asyncHandler(async (req, res) => {
  requireFields(req.body, ["assigneeId"]);
  const task = taskService.assignTask(req.params.id, req.body.assigneeId);
  res.json({ success: true, data: task });
});

const deleteTask = asyncHandler(async (req, res) => {
  taskService.deleteTask(req.params.id);
  res.status(204).send();
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
};
