const { asyncHandler } = require("../utils/asyncHandler");
const { HttpError } = require("../utils/httpError");
const { validateProject } = require("../utils/validators");
const projectService = require("../services/project.service");

const getProjects = asyncHandler(async (req, res) => {
  const projects = projectService.listProjects();
  res.json({ success: true, count: projects.length, data: projects });
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = projectService.findProjectById(req.params.id);
  if (!project) {
    throw new HttpError(404, "Proje bulunamadı");
  }
  res.json({ success: true, data: project });
});

const createProject = asyncHandler(async (req, res) => {
  validateProject(req.body);
  const project = projectService.createProject(req.body);
  res.status(201).json({ success: true, data: project });
});

const updateProject = asyncHandler(async (req, res) => {
  validateProject(req.body, { partial: true });
  const project = projectService.updateProject(req.params.id, req.body);
  res.json({ success: true, data: project });
});

const deleteProject = asyncHandler(async (req, res) => {
  projectService.deleteProject(req.params.id);
  res.status(204).send();
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
