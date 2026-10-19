const { getCollection, saveCollection } = require("../data/store");
const { createId } = require("../utils/id");
const { HttpError } = require("../utils/httpError");
const { normalizeString } = require("../utils/validators");
const { findEmployeeById } = require("./employee.service");
const { findProjectById } = require("./project.service");

function listTasks(filters = {}) {
  let tasks = getCollection("tasks");

  if (filters.status) {
    tasks = tasks.filter((task) => task.status === filters.status);
  }
  if (filters.priority) {
    tasks = tasks.filter((task) => task.priority === filters.priority);
  }
  if (filters.assigneeId) {
    tasks = tasks.filter((task) => task.assigneeId === filters.assigneeId);
  }
  if (filters.projectId) {
    tasks = tasks.filter((task) => task.projectId === filters.projectId);
  }

  return tasks;
}

function findTaskById(id) {
  return getCollection("tasks").find((task) => task.id === id) || null;
}

function assertRelations({ projectId, assigneeId }) {
  if (projectId && !findProjectById(projectId)) {
    throw new HttpError(400, "Geçersiz projectId: proje bulunamadı");
  }

  if (assigneeId && !findEmployeeById(assigneeId)) {
    throw new HttpError(400, "Geçersiz assigneeId: çalışan bulunamadı");
  }
}

function createTask(payload) {
  assertRelations({
    projectId: payload.projectId,
    assigneeId: payload.assigneeId,
  });

  const tasks = getCollection("tasks");
  const now = new Date().toISOString();

  const task = {
    id: createId(),
    title: normalizeString(payload.title),
    description: normalizeString(payload.description) || "",
    projectId: payload.projectId,
    assigneeId: payload.assigneeId || null,
    status: payload.status || "todo",
    priority: payload.priority || "medium",
    dueDate: payload.dueDate || null,
    createdAt: now,
    updatedAt: now,
  };

  tasks.push(task);
  saveCollection("tasks", tasks);
  return task;
}

function updateTask(id, payload) {
  const tasks = getCollection("tasks");
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    throw new HttpError(404, "Görev bulunamadı");
  }

  assertRelations({
    projectId: payload.projectId,
    assigneeId: payload.assigneeId,
  });

  const current = tasks[index];
  const updated = {
    ...current,
    title: payload.title ? normalizeString(payload.title) : current.title,
    description:
      payload.description !== undefined
        ? normalizeString(payload.description) || ""
        : current.description,
    projectId: payload.projectId || current.projectId,
    assigneeId:
      payload.assigneeId !== undefined ? payload.assigneeId : current.assigneeId,
    status: payload.status || current.status,
    priority: payload.priority || current.priority,
    dueDate: payload.dueDate !== undefined ? payload.dueDate : current.dueDate,
    updatedAt: new Date().toISOString(),
  };

  tasks[index] = updated;
  saveCollection("tasks", tasks);
  return updated;
}

function updateTaskStatus(id, status) {
  return updateTask(id, { status });
}

function assignTask(id, assigneeId) {
  return updateTask(id, { assigneeId });
}

function deleteTask(id) {
  const tasks = getCollection("tasks");
  const exists = tasks.some((task) => task.id === id);

  if (!exists) {
    throw new HttpError(404, "Görev bulunamadı");
  }

  saveCollection(
    "tasks",
    tasks.filter((task) => task.id !== id)
  );
}

module.exports = {
  listTasks,
  findTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  assignTask,
  deleteTask,
};
