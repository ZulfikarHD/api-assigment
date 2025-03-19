# API ASSIGMENT

## Fitur

- Operasi CRUD lengkap untuk manajemen User
- Atribut User: id (UUID), name (string), email (unique), age (number)
- Validasi input menggunakan middleware
- Pencatatan log untuk setiap request ke file
- Pengujian API menggunakan Jest
- Integrasi dengan database MySQL
- Arsitektur MVC dengan Service layer

## Tech Stack

- Backend: Laravel
- Database: MySQL
- Testing: Jest

## Instalasi

1. Clone repository
```bash
git clone https://github.com/ZulfikarHD/api-assigment
cd api-assigment
```

2. Instal dependensi
```bash
composer install
npm install
```

3. Konfigurasi environment
```bash
cp .env.example .env
```

4. Pengaturan database di `.env`
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Generate application key
```bash
php artisan key:generate
```

6. Jalankan migrations
```bash
php artisan migrate
```

## Menjalankan Aplikasi

```bash
php artisan serve
```

API akan tersedia di `http://localhost:8000/api`.

## Endpoint API

- **GET /api/users** - Mendapatkan daftar semua user
- **GET /api/users/{id}** - Mendapatkan data user berdasarkan ID
- **POST /api/users** - Membuat user baru
- **PUT /api/users/{id}** - Memperbarui data user
- **DELETE /api/users/{id}** - Menghapus user

## Contoh Request

Membuat user:
```json
POST /api/users
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 30
}
```

## Menjalankan Testing

```bash
npm run test 
```

## Struktur Proyek

- **app/Http/Controllers/Api** - Controller API
- **app/Http/Middleware** - Validasi request dan logging
- **app/Models** - Model database
- **app/Services** - Logika bisnis
- **tests/api** - Pengujian API menggunakan Jest

