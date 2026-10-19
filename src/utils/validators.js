const { HttpError } = require("./httpError");
const {
  TASK_STATUSES,
  TASK_PRIORITIES,
  PROJECT_STATUSES,
  EMPLOYEE_ROLES,
} = require("../config/constants");

function requireFields(payload, fields) {
  const missing = fields.filter((field) => {
    const value = payload[field];
    return value === undefined || value === null || String(value).trim() === "";
  });

  if (missing.length > 0) {
    throw new HttpError(400, "Eksik alanlar var", { missing });
  }
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function normalizeString(value) {
  return typeof value === "string" ? value.trim() : value;
}

function ensureEnum(value, allowed, fieldName) {
  if (value === undefined || value === null) {
    return;
  }

  if (!allowed.includes(value)) {
    throw new HttpError(400, `${fieldName} geçersiz`, {
      field: fieldName,
      allowed,
    });
  }
}

function ensureIsoDate(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, `${fieldName} geçerli bir tarih olmalı (ISO 8601)`);
  }
}

function validateEmployee(payload, { partial = false } = {}) {
  if (!partial) {
    requireFields(payload, ["name", "email", "role"]);
  }

  if (payload.email !== undefined && !isEmail(payload.email)) {
    throw new HttpError(400, "Geçerli bir e-posta adresi girin");
  }

  ensureEnum(payload.role, EMPLOYEE_ROLES, "role");
}

function validateProject(payload, { partial = false } = {}) {
  if (!partial) {
    requireFields(payload, ["name"]);
  }

  ensureEnum(payload.status, PROJECT_STATUSES, "status");
  ensureIsoDate(payload.startDate, "startDate");
  ensureIsoDate(payload.endDate, "endDate");
}

function validateTask(payload, { partial = false } = {}) {
  if (!partial) {
    requireFields(payload, ["title", "projectId"]);
  }

  ensureEnum(payload.status, TASK_STATUSES, "status");
  ensureEnum(payload.priority, TASK_PRIORITIES, "priority");
  ensureIsoDate(payload.dueDate, "dueDate");
}

module.exports = {
  requireFields,
  normalizeString,
  validateEmployee,
  validateProject,
  validateTask,
};
