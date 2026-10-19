const { listTasks } = require("./task.service");
const { listEmployees } = require("./employee.service");
const { listProjects, findProjectById } = require("./project.service");
const { HttpError } = require("../utils/httpError");
const { TASK_STATUSES, TASK_PRIORITIES } = require("../config/constants");

function countBy(items, field, keys) {
  return keys.reduce((acc, key) => {
    acc[key] = items.filter((item) => item[field] === key).length;
    return acc;
  }, {});
}

function getSummary() {
  const tasks = listTasks();
  const employees = listEmployees();
  const projects = listProjects();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = tasks.filter((task) => {
    if (!task.dueDate || task.status === "done") {
      return false;
    }
    return new Date(task.dueDate) < today;
  });

  return {
    totals: {
      employees: employees.length,
      projects: projects.length,
      tasks: tasks.length,
      overdueTasks: overdue.length,
    },
    tasksByStatus: countBy(tasks, "status", TASK_STATUSES),
    tasksByPriority: countBy(tasks, "priority", TASK_PRIORITIES),
  };
}

function getTasksByStatus() {
  const tasks = listTasks();
  return TASK_STATUSES.map((status) => ({
    status,
    count: tasks.filter((task) => task.status === status).length,
  }));
}

function getTasksByEmployee() {
  const tasks = listTasks();
  const employees = listEmployees();

  return employees.map((employee) => {
    const assigned = tasks.filter((task) => task.assigneeId === employee.id);
    return {
      employeeId: employee.id,
      name: employee.name,
      role: employee.role,
      taskCount: assigned.length,
      openTaskCount: assigned.filter((task) => task.status !== "done").length,
    };
  });
}

function getOverdueTasks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return listTasks().filter((task) => {
    if (!task.dueDate || task.status === "done") {
      return false;
    }
    return new Date(task.dueDate) < today;
  });
}

function getProjectProgress(projectId) {
  const project = findProjectById(projectId);
  if (!project) {
    throw new HttpError(404, "Proje bulunamadı");
  }

  const tasks = listTasks({ projectId });
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const progress =
    tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100);

  return {
    project,
    taskCount: tasks.length,
    doneCount,
    progressPercent: progress,
    tasksByStatus: countBy(tasks, "status", TASK_STATUSES),
  };
}

module.exports = {
  getSummary,
  getTasksByStatus,
  getTasksByEmployee,
  getOverdueTasks,
  getProjectProgress,
};
