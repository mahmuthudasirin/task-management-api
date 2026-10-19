# Görev Yönetim API — Proje Tanıtım Dokümanı

## 1. Amaç

Bu proje, yazılım ekiplerinin görev, proje ve çalışan sorumluluklarını tek bir REST API üzerinden takip edebilmesi için geliştirilmiştir. Ekip üyeleri görev oluşturur, görevi bir çalışana atar, durum ve önceliğini günceller ve proje ilerlemesini raporlarla izler. Arayüz bu teslimatın kapsamında değildir; istemci Postman veya benzeri bir HTTP istemcisidir.

## 2. Senaryo

Bir ekip aynı anda birden fazla yazılım projesi yürütür. Her projenin adı, açıklaması, durumu ve tarih aralığı vardır. Görevler bir projeye bağlıdır; başlık, açıklama, atanan çalışan, durum, öncelik ve son tarih taşır. Çalışanların rolü ve departmanı kayıtlıdır.

Örnek akış: ekip “Müşteri Portalı” projesine “API dokümantasyonu” görevini ekler, görevi bir backend geliştiricisine atar, durumu `todo` değerinden `in_progress` değerine çeker ve geciken görevleri raporlar. Veri kalıcı olarak `src/data/db.json` dosyasında tutulur. Sunucu ilk açılışta dosya yoksa örnek çalışan, proje ve görev kayıtlarını yazar.

## 3. Kapsam

Zorunlu çekirdek, görev kaynağı üzerinde ekleme, listeleme, detay, güncelleme ve silmedir. Bunun yanında senaryoyu tamamlayan çalışan ve proje CRUD işlemleri, görevi atama, durum güncelleme, sorgu ile filtreleme ve özet raporlar vardır.

Her HTTP isteği logger middleware içinden geçer. Konsola zaman damgası, HTTP metodu, adres, durum kodu ve süre yazılır. Böylece istekler geliştirme sırasında izlenebilir.

## 4. Teknolojiler ve mimari

Uygulama Node.js 18 ve Express ile yazılmıştır. Ek bağımlılıklar `cors` ve `dotenv` paketleridir. Kimlik doğrulama ve veritabanı sunucusu yoktur; kasıtlı olarak sade, dosya tabanlı bir JSON katmanı kullanılmıştır.

İstek şu sırayla ilerler:

1. `src/server.js` portu açar ve gerekirse örnek veriyi üretir.
2. `src/app.js` CORS, JSON gövde ayrıştırma ve logger middleware’ini bağlar.
3. `src/routes/` isteği kaynağa göre çalışan, proje, görev veya rapor route dosyasına dağıtır.
4. `src/controllers/` HTTP cevabını hazırlar.
5. `src/services/` doğrulanmış iş kuralını ve CRUD işlemini çalıştırır.
6. `src/data/store.js` okuma ve yazmayı `db.json` üzerinde yapar.

## 5. Veri modeli

| Kaynak | Alanlar |
| --- | --- |
| Çalışan | `name`, `email`, `role`, `department` |
| Proje | `name`, `description`, `status`, `startDate`, `endDate` |
| Görev | `title`, `description`, `projectId`, `assigneeId`, `status`, `priority`, `dueDate` |

Görev durumu `todo`, `in_progress`, `review`, `done` veya `blocked` olabilir. Öncelik `low`, `medium`, `high` veya `critical` değerlerinden biridir. Proje durumu `planned`, `active`, `on_hold` veya `completed` olur. Çalışan rolü `developer`, `designer`, `qa`, `pm` veya `devops` olabilir. Eksik veya geçersiz alanlar 400, bulunamayan kayıt 404 döner.

## 6. API özeti

Taban adres `http://localhost:3000/api` (`.env` içindeki `PORT` ile değişir).

- Çalışanlar: `GET/POST /employees`, `GET/PUT/DELETE /employees/:id`
- Projeler: `GET/POST /projects`, `GET/PUT/DELETE /projects/:id`
- Görevler: `GET/POST /tasks`, `GET/PUT/DELETE /tasks/:id`, `PATCH /tasks/:id/status`, `PATCH /tasks/:id/assign`
- Raporlar: özet, duruma göre görev, çalışana göre görev, geciken görevler, proje ilerleme yüzdesi
- Sağlık: `GET /health`

Görev listesi `status`, `priority`, `assigneeId` ve `projectId` sorgu parametreleriyle süzülür.

## 7. Çalıştırma ve doğrulama

```bash
npm install
copy .env.example .env
npm start
```

`.env` yoksa sunucu 3001 portunu kullanır. Örnek dosya kopyalanırsa port 3000 olur. Görev CRUD akışı Postman koleksiyonu (`postman/Gorev-Yonetim-API.postman_collection.json`) ve şu ekran görüntüleriyle gösterilmiştir:

- `docs/postman/01-gorev-ekle.png` — `POST /api/tasks`, 201
- `docs/postman/02-gorev-listele.png` — `GET /api/tasks`, 200
- `docs/postman/03-gorev-detay.png` — `GET /api/tasks/:id`, 200
- `docs/postman/04-gorev-guncelle.png` — `PUT /api/tasks/:id`, 200
- `docs/postman/05-gorev-sil.png` — `DELETE /api/tasks/:id`, 204

## 8. Sonuç

Proje, yönergedeki görev takip senaryosunu Node.js ve Express üzerinde, kaynak bazlı routing, istek loglama ve JSON kalıcılığı ile karşılar. Kurulum adımları `README.md` dosyasındadır; bu doküman kapsamı, modeli ve doğrulama kanıtının yerini özetler.
