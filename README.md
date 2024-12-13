# Task Manager Application

Modern web teknolojileri ile geliştirilmiş, kapsamlı görev yönetimi uygulaması.

## 🚀 Teknolojiler

### Backend
- Node.js & Express.js
- MySQL (Ana veritabanı)
- MongoDB (Aktivite logları için)
- Redis (Önbellekleme ve session yönetimi)
- JWT Authentication

### Frontend
- Vue 3
- PrimeVue UI Components
- Pinia (State management)
- Axios

## 💾 Veritabanı Yapısı

### MySQL Modelleri

#### User Model
```javascript
{
  id: integer (primary key, auto increment),
  firstName: string(50),
  lastName: string(50),
  email: string (unique),
  password: string (hashed),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Task Model
```javascript
{
  id: integer (primary key, auto increment),
  userId: integer (foreign key -> User.id),
  title: string,
  description: text,
  priority: enum('low', 'medium', 'high'),
  dueDate: date,
  status: enum('pending', 'completed'),
  mediaType: enum('image', 'video', 'document'),
  mediaUrl: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### MongoDB Model

#### Activity Log Model
```javascript
{
  taskId: Number,
  userId: Number,
  action: enum[
    'CREATED',
    'UPDATED',
    'STATUS_CHANGED',
    'FILE_ADDED',
    'DELETED',
    'MAIL_SENT'
  ],
  oldValue: Mixed,
  newValue: Mixed,
  details: Mixed,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 📝 API Endpoints

### Kullanıcı İşlemleri
- `POST /api/auth/register` - Yeni kullanıcı kaydı
  ```javascript
  {
    firstName: string,
    lastName: string,
    email: string,
    password: string
    confirmPassword: string
  }
  ```
- `POST /api/auth/login` - Kullanıcı girişi
  ```javascript
  {
    email: string,
    password: string
  }
  ```

### Görev İşlemleri
- `GET /api/tasks` - Görevleri listele
- `POST /api/tasks` - Yeni görev oluştur
  ```javascript
  {
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high',
    status: 'pending' | 'completed'
    dueDate: Date,
    file?: File
  }
  ```
- `PUT /api/tasks/:id` - Görev güncelle
- `DELETE /api/tasks/:id` - Görev sil

## 🔄 Aktivite Logları

Sistem aşağıdaki aktiviteleri loglar:
- Görev oluşturma
- Görev güncelleme
- Durum değişiklikleri
- Dosya ekleme
- Görev silme
- Mail gönderimi

Her log kaydı şunları içerir:
- İlgili görev ID'si
- İşlemi yapan kullanıcı ID'si
- İşlem tipi
- Eski değer (güncelleme durumunda)
- Yeni değer
- Ek detaylar
- Zaman damgası

## 📦 Medya Yönetimi

Desteklenen medya tipleri:
- Resim
- Video
- Döküman

Medya dosyaları `uploads/` dizininde saklanır ve veritabanında URL referansı tutulur.

## 🚦 Kurulum

1. Repoyu klonlayın
```bash
git clone <repo-url>
cd task-manager
```

2. Environment değişkenlerini ayarlayın
```bash
# server/.env
PORT=3000
NODE_ENV=development

# MySQL
MYSQL_HOST=mysql
MYSQL_DATABASE=taskmanager
MYSQL_USER=user
MYSQL_PASSWORD=password

# MongoDB
MONGODB_URI=mongodb://root:rootpassword@mongodb:27017/taskmanager?authSource=admin

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

3. Docker ile çalıştırın
```bash
docker-compose up --build
```

## 📱 Kullanıcı Arayüzü

Frontend uygulaması şu özellikleri içerir:
- Kullanıcı kaydı ve girişi
- Görev listesi ve filtreleme
- Görev oluşturma/düzenleme formu
- Medya yükleme ve önizleme
- Görev durumu güncelleme
- Görev silme

## 🔧 Geliştirme

```bash
# Frontend geliştirme
cd client
npm install
npm run dev

# Backend geliştirme
cd server
npm install
npm run dev
```

## 📚 Kullanılan Paketler

### Backend
- express
- sequelize
- mongoose
- redis
- jsonwebtoken
- bcrypt
- multer

### Frontend
- vue
- primevue
- pinia
- axios
- vue-router

## 📝 Lisans

MIT License
