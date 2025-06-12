

---

````markdown
# 📚 Library App (ZYLYTY Challenge)

A RESTful API built with **Node.js**, **Express**, and **MySQL (v8)** for managing users, books, and borrowing activities in the ZYLYTY Library System. Designed to support user registration, authentication, and admin-level management of books.

---

## 🚀 Features

- User registration and login (with hashed passwords)
- Book CRUD operations
- Borrow/return book logic
- Admin authentication via API key
- Dockerized for easy deployment
- Auto-creates necessary MySQL tables on startup

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MySQL 8
- **ORM**: (Custom SQL )
- **Authentication**: JWT / API Key (for admin)
- **Environment Handling**: dotenv
- **Containerization**: Docker

---

## 🧪 API Endpoints (Example)

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| POST   | `/register`          | Register a new user                |
| POST   | `/login`             | Login with credentials             |
| GET    | `/books`             | Get list of available books        |
| POST   | `/books`             | Add new book (**admin only**)      |
| PUT    | `/books/:id`         | Update book info (**admin only**)  |
| DELETE | `/books/:id`         | Delete a book (**admin only**)     |
| POST   | `/borrow/:bookId`    | Borrow a book                      |
| POST   | `/return/:bookId`    | Return a borrowed book             |

> Admin endpoints require an `Authorization` header with the `ADMIN_API_KEY`.

---

## ⚙️ Environment Variables

Your app reads the following **environment variables**:

| Name               | Description                                      |
|--------------------|--------------------------------------------------|
| `ADMIN_API_KEY`    | Secret key used for admin endpoints              |
| `API_LISTENING_PORT` | Port the API will listen on                    |
| `DB_HOST`          | MySQL host                                       |
| `DB_NAME`          | MySQL database name                              |
| `DB_PASSWORD`      | MySQL password                                   |
| `DB_PORT`          | MySQL port                                       |
| `DB_USERNAME`      | MySQL user                                       |

---

## 🐳 Running with Docker

### 1. Build the Docker image:
```bash
docker build -t library-app .
````

### 2. Run the Docker container:

```bash
docker run -p 3000:3000 \
  -e ADMIN_API_KEY=admin_secret_key_123 \
  -e API_LISTENING_PORT=3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_NAME=library_db \
  -e DB_PASSWORD=your_db_password \
  -e DB_PORT=3306 \
  -e DB_USERNAME=root \
  library-app
```

> 💡 `host.docker.internal` is used to access your local MySQL server from within Docker.

---

## 📁 Project Structure

```
.
├── controller/
│   └── userController.js
├── routes/
│   └── userRoutes.js
├── models/
│   └── user.js, book.js
├── db/
│   └── connection.js
├── server.js
├── Dockerfile
├── package.json
└── README.md
```

---




  ```
  echo ".env" >> .gitignore
  ```

---

```

---
```
