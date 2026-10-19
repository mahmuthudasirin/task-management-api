const { getCollection, saveCollection } = require("../data/store");
const { createId } = require("../utils/id");
const { HttpError } = require("../utils/httpError");
const { normalizeString } = require("../utils/validators");

function listEmployees() {
  return getCollection("employees");
}

function findEmployeeById(id) {
  return listEmployees().find((employee) => employee.id === id) || null;
}

function createEmployee(payload) {
  const employees = listEmployees();
  const email = normalizeString(payload.email).toLowerCase();

  if (employees.some((employee) => employee.email === email)) {
    throw new HttpError(409, "Bu e-posta ile kayıtlı çalışan zaten var");
  }

  const now = new Date().toISOString();
  const employee = {
    id: createId(),
    name: normalizeString(payload.name),
    email,
    role: payload.role,
    department: normalizeString(payload.department) || null,
    createdAt: now,
    updatedAt: now,
  };

  employees.push(employee);
  saveCollection("employees", employees);
  return employee;
}

function updateEmployee(id, payload) {
  const employees = listEmployees();
  const index = employees.findIndex((employee) => employee.id === id);

  if (index === -1) {
    throw new HttpError(404, "Çalışan bulunamadı");
  }

  if (payload.email) {
    const email = normalizeString(payload.email).toLowerCase();
    const used = employees.some(
      (employee) => employee.email === email && employee.id !== id
    );
    if (used) {
      throw new HttpError(409, "Bu e-posta başka bir çalışana ait");
    }
    payload.email = email;
  }

  const current = employees[index];
  const updated = {
    ...current,
    name: payload.name ? normalizeString(payload.name) : current.name,
    email: payload.email || current.email,
    role: payload.role || current.role,
    department:
      payload.department !== undefined
        ? normalizeString(payload.department) || null
        : current.department,
    updatedAt: new Date().toISOString(),
  };

  employees[index] = updated;
  saveCollection("employees", employees);
  return updated;
}

function deleteEmployee(id) {
  const employees = listEmployees();
  const exists = employees.some((employee) => employee.id === id);

  if (!exists) {
    throw new HttpError(404, "Çalışan bulunamadı");
  }

  const tasks = getCollection("tasks");
  const assigned = tasks.filter((task) => task.assigneeId === id);
  if (assigned.length > 0) {
    throw new HttpError(409, "Atanmış görevi olan çalışan silinemez", {
      taskCount: assigned.length,
    });
  }

  saveCollection(
    "employees",
    employees.filter((employee) => employee.id !== id)
  );
}

module.exports = {
  listEmployees,
  findEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
