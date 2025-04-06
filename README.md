# 📊 Data Visualization Platform - Final Year Major Project

## 🧠 Project Overview
A scalable, full-stack **Data Visualization Platform** that allows users to:
- Upload and manage data sources (CSV, JSON, APIs)
- Create rich visualizations (bar, pie, line, scatter, etc.)
- Configure charts with custom fields (x/y axis, colors, etc.)
- Export and share charts (PDF, PNG, JSON, CSV)
- Enable collaboration, real-time updates, and AI-driven insights

This project aims to bring **real-world dashboard and data storytelling features** into a user-friendly web app, with a clean backend architecture and future-ready extensibility.

---

## 🏗️ System Architecture

### 🌐 High-Level Flow:
```
Users → Visualizations → Data Sources → Exports/Sharing
```

### ✅ Current Tech Stack:
- **Frontend**: React (TBD)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT Token-based Authentication
- **Storage**: Local file storage (for now)

---

## 📦 Completed Modules

### 🔐 Authentication
- [x] User signup/login (`/api/auth/register`, `/login`)
- [x] JWT token generation and validation middleware
- [x] User profile retrieval (`/api/users/me`)

### 📂 Data Sources
- [x] Upload CSV/JSON data
- [x] Store in MongoDB with schema detection
- [x] Link to user & visualizations
- [x] DataSource model with validations

### 📊 Visualization Builder
- [x] Create visualizations
- [x] Configurable fields: `xField`, `yField`, `chartType`
- [x] Connect to Data Source via `datasourceId`
- [x] Full CRUD API endpoints

### 🧪 Testing
- [x] Auth & visualization routes tested using Postman
- [x] Mongoose relationships verified

---

## 🚧 Pending Features

### 📤 Export & Share
- [ ] Export charts to PNG, PDF, CSV, JSON
- [ ] Shareable links and download endpoints
- [ ] Export model + route

### 📜 Activity Logs
- [ ] Track actions like create, edit, delete, share
- [ ] Store logs in DB for analytics / audit

### 🧑‍🤝‍🧑 Collaboration & Access Control
- [ ] Invite collaborators to visualizations
- [ ] RBAC: Admin, User, Collaborator roles

### 📡 Real-Time Updates
- [ ] WebSocket (Socket.io) for live dashboards
- [ ] Real-time sync for teams

### 🧠 AI Smart Features
- [ ] Auto-suggest chart types
- [ ] Analyze and summarize data trends

### 🌓 UI/UX Enhancements
- [ ] Frontend dashboard (React setup pending)
- [ ] Dark/light mode toggle
- [ ] Chart customization (colors, themes)

---

## 📚 Models Summary

### 🧍 User
- name, email, password (hashed), role
- has many visualizations, data sources

### 📊 Visualization
- title, description, chartType, datasourceId
- config (JSON), xField, yField, isPublic

### 📂 DataSource
- filePath / sourceURL, schema, sourceType (CSV/JSON/API)
- belongs to user

### 📤 Export
- visualizationId, format, downloadLink

### 📝 ActivityLog
- userId, actionType, visualizationId, timestamp

---

## 🚀 Roadmap Snapshot

| Feature                        | Status       |
|-------------------------------|--------------|
| Auth (register/login)         | ✅ Completed |
| Data source upload & schema   | ✅ Completed |
| Visualization CRUD            | ✅ Completed |
| API Testing                   | ✅ Completed |
| Export/Download charts        | 🔜 Pending   |
| Activity log tracking         | 🔜 Pending   |
| Role-based access control     | 🔜 Pending   |
| WebSocket real-time updates   | 🔜 Pending   |
| AI insight engine             | 🔜 Pending   |
| Frontend (React integration)  | ⚙️ In Progress |
| Theme preferences             | 🔜 Pending   |
| Final deployment              | 🔜 Pending   |

---

## 🧭 Next Steps
- Begin **frontend integration**: React setup, pages for auth, data, and visualizations
- Add **export/share features**
- Implement **activity logs** model and API
- Begin **real-time dashboard** and **role management** modules

---

Let’s use this README to track progress as we move module by module 💻
We can update this file every few days to reflect new changes.

> ✅ Ask me anytime to generate docs, pitch decks, or reports from this!

