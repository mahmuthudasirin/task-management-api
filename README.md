# Görev Yönetim API

Yazılım ekiplerinin görev, proje ve çalışan sorumluluklarını takip ettiği REST API.

## Gereksinimler

- Node.js 18+

## Kurulum

```bash
npm install
```

İsteğe bağlı ortam değişkenleri için:

```bash
copy .env.example .env
```

## Çalıştırma

```bash
npm run dev
```

veya

```bash
npm start
```

`.env` dosyası yoksa sunucu `http://localhost:3001` adresinde açılır. `.env.example` kopyalanırsa port `3000` olur. İlk çalıştırmada veri dosyası yoksa örnek çalışan, proje ve görev verisi `src/data/db.json` dosyasına yazılır.

Proje tanıtımı: [docs/PROJE_TANITIM.md](docs/PROJE_TANITIM.md)

Postman koleksiyonu: [postman/Gorev-Yonetim-API.postman_collection.json](postman/Gorev-Yonetim-API.postman_collection.json)

Görev CRUD ekran görüntüleri `docs/postman/` klasöründedir.

## Kaynak modeli

| Kaynak | Açıklama |
| --- | --- |
| Employee | Çalışan: `name`, `email`, `role`, `department` |
| Project | Proje: `name`, `description`, `status`, `startDate`, `endDate` |
| Task | Görev: `title`, `description`, `projectId`, `assigneeId`, `status`, `priority`, `dueDate` |

**Görev durumu:** `todo`, `in_progress`, `review`, `done`, `blocked`  
**Görev önceliği:** `low`, `medium`, `high`, `critical`  
**Proje durumu:** `planned`, `active`, `on_hold`, `completed`  
**Rol:** `developer`, `designer`, `qa`, `pm`, `devops`

## Endpointler

### Sağlık

- `GET /health`

### Çalışanlar

- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

### Projeler

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`

### Görevler

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `PATCH /api/tasks/:id/assign`
- `DELETE /api/tasks/:id`

Filtreleme (query): `status`, `priority`, `assigneeId`, `projectId`

Örnek: `GET /api/tasks?status=todo&priority=high`

### Raporlar

- `GET /api/reports/summary`
- `GET /api/reports/tasks-by-status`
- `GET /api/reports/tasks-by-employee`
- `GET /api/reports/overdue-tasks`
- `GET /api/reports/projects/:projectId/progress`

## Örnek istekler

Çalışan oluştur:

```bash
curl -X POST http://localhost:3000/api/employees ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Can Öz\",\"email\":\"can.oz@sirket.com\",\"role\":\"developer\",\"department\":\"Backend\"}"
```

Görev oluştur:

```bash
curl -X POST http://localhost:3000/api/tasks ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"API dokümantasyonu\",\"projectId\":\"PROJE_ID\",\"assigneeId\":\"CALISAN_ID\",\"priority\":\"high\",\"status\":\"todo\"}"
```

Durum güncelle:

```bash
curl -X PATCH http://localhost:3000/api/tasks/GOREV_ID/status ^
  -H "Content-Type: application/json" ^
  -d "{\"status\":\"in_progress\"}"
```

Ata:

```bash
curl -X PATCH http://localhost:3000/api/tasks/GOREV_ID/assign ^
  -H "Content-Type: application/json" ^
  -d "{\"assigneeId\":\"CALISAN_ID\"}"
```

## Mimari

```
src/
  app.js                 Express uygulaması ve middleware sırası
  server.js              Port dinleme ve ilk veri tohumlama
  middleware/logger.js   İstek loglama
  routes/                Kaynak bazlı routing
  controllers/           HTTP katmanı
  services/              İş kuralları ve CRUD
  data/                  JSON dosya tabanlı veri yönetimi
```
