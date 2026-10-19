const { getCollection, saveCollection } = require("../data/store");
const { createId } = require("../utils/id");
const { HttpError } = require("../utils/httpError");
const { normalizeString } = require("../utils/validators");

function listProjects() {
  return getCollection("projects");
}

function findProjectById(id) {
  return listProjects().find((project) => project.id === id) || null;
}

function createProject(payload) {
  const projects = listProjects();
  const now = new Date().toISOString();

  const project = {
    id: createId(),
    name: normalizeString(payload.name),
    description: normalizeString(payload.description) || "",
    status: payload.status || "planned",
    startDate: payload.startDate || null,
    endDate: payload.endDate || null,
    createdAt: now,
    updatedAt: now,
  };

  projects.push(project);
  saveCollection("projects", projects);
  return project;
}

function updateProject(id, payload) {
  const projects = listProjects();
  const index = projects.findIndex((project) => project.id === id);

  if (index === -1) {
    throw new HttpError(404, "Proje bulunamadı");
  }

  const current = projects[index];
  const updated = {
    ...current,
    name: payload.name ? normalizeString(payload.name) : current.name,
    description:
      payload.description !== undefined
        ? normalizeString(payload.description) || ""
        : current.description,
    status: payload.status || current.status,
    startDate:
      payload.startDate !== undefined ? payload.startDate : current.startDate,
    endDate: payload.endDate !== undefined ? payload.endDate : current.endDate,
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updated;
  saveCollection("projects", projects);
  return updated;
}

function deleteProject(id) {
  const projects = listProjects();
  const exists = projects.some((project) => project.id === id);

  if (!exists) {
    throw new HttpError(404, "Proje bulunamadı");
  }

  const tasks = getCollection("tasks");
  const related = tasks.filter((task) => task.projectId === id);
  if (related.length > 0) {
    throw new HttpError(409, "Görevi olan proje silinemez", {
      taskCount: related.length,
    });
  }

  saveCollection(
    "projects",
    projects.filter((project) => project.id !== id)
  );
}

module.exports = {
  listProjects,
  findProjectById,
  createProject,
  updateProject,
  deleteProject,
};
