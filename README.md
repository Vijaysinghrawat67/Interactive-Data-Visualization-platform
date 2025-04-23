

# 📊 **Data Visualization application - Final Year Major Project**

## 🧠 **Project Overview**
A scalable, full-stack **Data Visualization Platform** designed to empower users with:
- **Data Management**: Upload and manage data sources (CSV, JSON, APIs).
- **Dynamic Visualizations**: Create impactful charts like bar, pie, line, scatter, etc.
- **Chart Configuration**: Customize fields (x/y axis, colors, labels).
- **Exports and Sharing**: Export visualizations in multiple formats (PDF, PNG, JSON, CSV).
- **Collaboration and Real-Time Updates**: Enable team-based workflows with live updates and AI-driven insights.

The platform aims to provide **real-world dashboarding and storytelling features** with a seamless user experience, a robust backend, and future-proof extensibility.

---

## 🏗️ **System Architecture**

### 🌐 **High-Level Flow**
```plaintext
Users → Visualizations → Data Sources → Exports/Sharing
```

### 🔧 **Tech Stack**
- **Frontend**: React
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT Token-based Authentication
- **Storage**: Local file storage, with options for cloud integration

---

## 🌟 **Platform Features**

### 🔐 **Authentication**
- User-friendly signup and login system.
- JWT-based token authentication for secure access.
- Personalized user profiles and session management.

### 📂 **Data Management**
- Upload data sources in CSV, JSON, or connect external APIs.
- Automatic schema detection to map fields accurately.
- Centralized repository for all data sources, linked to visualizations.
- Raw text input analysis for text-based data.

### 📊 **Visualization Builder**
- Create visualizations with multiple chart types:
  - Bar charts, pie charts, line graphs, scatter plots, and more.
- Configure visualization parameters:
  - Map `xField` and `yField`, customize themes and labels.
- Interactive and responsive charts for better storytelling.
- Intuitive interface for creating and managing visualizations.

### 📤 **Export and Share**
- Export visualizations in popular formats:
  - **PDF**, **PNG**, **CSV**, and **JSON**.
- Shareable links for easy collaboration with teams and stakeholders.
- Configurable export options to include metadata and branding.

### 📜 **Activity Logs**
- Track user actions such as creating, editing, deleting, and sharing visualizations.
- Store logs in a database for analytics, user tracking, and auditing.

### 🧑‍🤝‍🧑 **Collaboration and Access Control**
- Invite collaborators to join projects and visualizations.
- Role-based access control (RBAC) with roles like Admin, Editor, and Viewer.
- Real-time synchronization for collaborative dashboards.

### 📡 **Real-Time Updates**
- WebSocket (Socket.io) integration for live data updates.
- Dynamically refreshed visualizations for monitoring and decision-making.

### 🧠 **AI-Powered Insights**
- Recommendations for chart types based on data patterns.
- Automated analysis and summarization of trends and key insights.

### 🌓 **User-Centric Design**
- Modern and minimalistic dashboard with smooth navigation.
- Light and dark mode for improved accessibility.
- Fully responsive interface, optimized for desktop, tablet, and mobile devices.

---

## 📚 **Data Models**

### 🧍 **User**
| **Field**       | **Type**          | **Description**                |
|------------------|-------------------|--------------------------------|
| `name`          | String            | Full name of the user          |
| `email`         | String            | Unique email address           |
| `password`      | String (hashed)   | Securely hashed password        |
| `role`          | Enum              | Admin, Editor, Viewer roles    |

### 📊 **Visualization**
| **Field**       | **Type**          | **Description**                |
|------------------|-------------------|--------------------------------|
| `title`         | String            | Visualization title            |
| `description`   | String            | Brief visualization summary    |
| `chartType`     | Enum              | Chart type (Bar, Pie, etc.)    |
| `datasourceId`  | ObjectId          | Linked data source             |
| `config`        | JSON              | Chart configuration metadata   |

### 📂 **Data Source**
| **Field**       | **Type**          | **Description**                |
|------------------|-------------------|--------------------------------|
| `sourceType`    | Enum              | Data type (CSV, JSON, API)     |
| `filePath`/`sourceURL` | String    | File path or API source         |
| `schema`        | Array[String]     | Schema fields extracted         |

### 📜 **Activity Log**
| **Field**       | **Type**          | **Description**                |
|------------------|-------------------|--------------------------------|
| `userId`        | ObjectId          | User performing the action     |
| `actionType`    | Enum              | Action type (Create, Edit, etc.)|
| `visualizationId` | ObjectId       | Affected visualization          |

### 📤 **Export**
| **Field**       | **Type**          | **Description**                |
|------------------|-------------------|--------------------------------|
| `visualizationId` | ObjectId        | Linked visualization           |
| `format`        | Enum              | Export format (PDF, PNG, etc.) |
| `downloadLink`  | String            | Downloadable link for export   |

---

---

