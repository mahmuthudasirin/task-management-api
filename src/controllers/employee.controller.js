const { asyncHandler } = require("../utils/asyncHandler");
const { HttpError } = require("../utils/httpError");
const { validateEmployee } = require("../utils/validators");
const employeeService = require("../services/employee.service");

const getEmployees = asyncHandler(async (req, res) => {
  const employees = employeeService.listEmployees();
  res.json({ success: true, count: employees.length, data: employees });
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = employeeService.findEmployeeById(req.params.id);
  if (!employee) {
    throw new HttpError(404, "Çalışan bulunamadı");
  }
  res.json({ success: true, data: employee });
});

const createEmployee = asyncHandler(async (req, res) => {
  validateEmployee(req.body);
  const employee = employeeService.createEmployee(req.body);
  res.status(201).json({ success: true, data: employee });
});

const updateEmployee = asyncHandler(async (req, res) => {
  validateEmployee(req.body, { partial: true });
  const employee = employeeService.updateEmployee(req.params.id, req.body);
  res.json({ success: true, data: employee });
});

const deleteEmployee = asyncHandler(async (req, res) => {
  employeeService.deleteEmployee(req.params.id);
  res.status(204).send();
});

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
