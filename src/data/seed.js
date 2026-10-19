const { createId } = require("../utils/id");
const { writeStore } = require("./store");

function seedIfEmpty() {
  const now = new Date().toISOString();

  const employees = [
    {
      id: createId(),
      name: "Mahmut Huda Şirin",
      email: "mahmut.huda@sirket.com",
      role: "developer",
      department: "Backend",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      name: "Musa Kolcuk",
      email: "musa.kolcuk@sirket.com",
      role: "pm",
      department: "Yönetim",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      name: "Recep Ali Kavcı",
      email: "recep.ali@sirket.com",
      role: "qa",
      department: "Kalite",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      name: "İsmail Kemal Şener",
      email: "ismail.kemal@sirket.com",
      role: "designer",
      department: "Tasarım",
      createdAt: now,
      updatedAt: now,
    }
  ];

  const projects = [
    {
      id: createId(),
      name: "Müşteri Portalı",
      description: "Müşteri paneli ve yetkilendirme",
      status: "active",
      startDate: "2026-09-01",
      endDate: "2026-12-15",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      name: "Mobil Uygulama",
      description: "iOS ve Android istemcileri",
      status: "planned",
      startDate: "2026-10-01",
      endDate: "2027-02-01",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const tasks = [
    {
      id: createId(),
      title: "Auth servisini yaz",
      description: "JWT tabanlı giriş ve yetkilendirme",
      projectId: projects[0].id,
      assigneeId: employees[0].id,
      status: "in_progress",
      priority: "high",
      dueDate: "2026-09-30",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      title: "Test senaryolarını hazırla",
      description: "Login ve görev atama senaryoları",
      projectId: projects[0].id,
      assigneeId: employees[2].id,
      status: "todo",
      priority: "medium",
      dueDate: "2026-10-05",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: createId(),
      title: "Sprint planı çıkar",
      description: "İlk 4 sprint için kapsam",
      projectId: projects[1].id,
      assigneeId: employees[1].id,
      status: "review",
      priority: "low",
      dueDate: "2026-08-01",
      createdAt: now,
      updatedAt: now,
    },
  ];

  writeStore({ employees, projects, tasks });
}

module.exports = { seedIfEmpty };
