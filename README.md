# 🏛 GovTime – Smart Government Appointment & Scheduling System

GovTime is a full-stack web application designed to simplify and digitalize government appointments.  
Users can create accounts, book appointments, view profiles, and manage notifications.  
Admins can monitor the system and manage requests. The platform focuses on *speed, automation, and security*.

---

## 🚀 Features

### 🧑‍💼 *User Features*
- Secure authentication (JWT + HTTP-only cookies)
- Profile management
- Book, view, and manage appointments
- Notification center for updates & reminders
- Mobile-friendly UI
- Automatic logout + token invalidation

---

## 🛠 Technology Stack

### *Frontend*
- React.js + Vite
- TailwindCSS
- Axios
- React Router DOM

### *Backend*
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Cookie-based sessions
- PM2 for production monitoring

---

## 🔐 Authentication System
GovTime uses:
- *Access token stored in HTTP-only cookies*
- Secure logout with cookie invalidation
- Route protection middleware
- Automatic redirect when logged out

---
### *Backend*
---

## 🧪 API Endpoints

### *Auth Routes*
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/login | Login user |
| POST | /api/v1/auth/logout | Logout + clear cookie |

### *Appointments*
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/appointments | Get all appointments |
| POST | /api/v1/appointments | Create appointment |

---

## ⚙ Running the Project

### *Backend*
```bash
cd Gov-time
npm install
-- run in dev mode
npm run dev
-- run in production mode
npm run prod

cd gove-frontend
npm install
npm run dev
