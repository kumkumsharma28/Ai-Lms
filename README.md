# 🎓 AI-Based Learning Management System (AI-LMS)

A full-stack AI-powered LMS built with **React + Vite** (frontend), **Node.js + Express** (backend), and **SQLite via sql.js** (database — no compilation needed on Windows).

---

## 📁 Project Structure

```
ai-lms/
├── backend/
│   ├── config/
│   │   ├── database.js         # sql.js SQLite (pure JS, works on all platforms)
│   │   └── initDb.js           # Optional standalone DB init script
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roadmapController.js
│   │   ├── userController.js
│   │   └── jobController.js
│   ├── middleware/
│   │   └── auth.js             # JWT protect + role-based authorize
│   ├── routes/
│   │   ├── auth.js
│   │   ├── roadmaps.js
│   │   ├── users.js
│   │   └── jobs.js
│   ├── database/               # Auto-created; contains lms.db
│   ├── server.js               # Entry point (auto-inits DB on start)
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/shared/Navbar.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── TeacherDashboard.jsx
│   │   │   ├── RecruiterDashboard.jsx
│   │   │   ├── RoadmapPage.jsx
│   │   │   └── RoadmapDetailPage.jsx
│   │   ├── utils/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── ai-lms.code-workspace
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js** v18 or higher → https://nodejs.org  
- **VS Code** → https://code.visualstudio.com  
- **Anthropic API key** → https://console.anthropic.com

> ✅ No Visual Studio Build Tools required. `sql.js` is pure JavaScript.

Verify:
```bash
node --version   # v18+
npm --version    # v9+
```

---

## 🚀 Setup in VS Code (Step by Step)

### Step 1 — Open the Project

```
File → Open Workspace from File → select ai-lms.code-workspace
```

Or just: `File → Open Folder → select the ai-lms/ folder`

---

### Step 2 — Set Up the Backend

Open the integrated terminal (`Ctrl+`` or Terminal → New Terminal`):

```bash
cd backend
npm install
```

Create your `.env` file:
```bash
# Windows:
copy .env.example .env

# Mac/Linux:
cp .env.example .env
```

Open `.env` and fill in:
```env
PORT=5000
JWT_SECRET=any_long_random_string_at_least_32_chars
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-your-key-here
NODE_ENV=development
```

> 💡 Get your API key at https://console.anthropic.com/keys

Start the backend (it auto-creates the database and seeds demo users):
```bash
npm run dev
```

Expected output:
```
✅ Demo users seeded.
🚀 AI-LMS Backend running on http://localhost:5000
```

---

### Step 3 — Set Up the Frontend

Open a **second terminal** (click the `+` icon in the terminal panel):

```bash
cd frontend
npm install
npm run dev
```

Expected output:
```
  VITE ready in ~500ms
  ➜  Local: http://localhost:5173/
```

---

### Step 4 — Open the App

Visit: **http://localhost:5173**

---

## 🔑 Demo Accounts

Password for all: `password123`

| Role      | Email                  |
|-----------|------------------------|
| Student   | student@example.com    |
| Teacher   | teacher@example.com    |
| Recruiter | recruiter@example.com  |

---

## 🗄️ Database (SQLite via sql.js)

- **No native compilation** — works on Windows, Mac, and Linux out of the box
- Database file is auto-created at `backend/database/lms.db` on first server start
- Data is persisted to disk after every write operation

To view the database visually in VS Code:
```
Extensions → search "SQLite Viewer" by Florian Klampfer → Install
```
Then open `backend/database/lms.db` directly.

**Tables:** `users`, `student_profiles`, `teacher_profiles`, `recruiter_profiles`, `roadmaps`, `roadmap_progress`, `courses`, `jobs`, `activity_log`

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint           | Description       |
|--------|--------------------|-------------------|
| POST   | /api/auth/register | Register          |
| POST   | /api/auth/login    | Login             |
| GET    | /api/auth/me       | Get current user  |

### Roadmaps
| Method | Endpoint                    | Description            |
|--------|-----------------------------|------------------------|
| POST   | /api/roadmaps               | Generate AI roadmap    |
| GET    | /api/roadmaps               | My roadmaps            |
| GET    | /api/roadmaps/:id           | Roadmap details        |
| PATCH  | /api/roadmaps/:id/progress  | Update module progress |
| DELETE | /api/roadmaps/:id           | Delete roadmap         |

### Users
| Method | Endpoint                              | Description           |
|--------|---------------------------------------|-----------------------|
| GET    | /api/users/profile                    | Get profile           |
| PUT    | /api/users/profile                    | Update profile        |
| GET    | /api/users/students                   | List all students     |
| GET    | /api/users/students/:id/portfolio     | Student portfolio     |

### Jobs
| Method | Endpoint       | Description       |
|--------|----------------|-------------------|
| GET    | /api/jobs      | All jobs          |
| POST   | /api/jobs      | Post a job        |
| GET    | /api/jobs/mine | My job listings   |
| DELETE | /api/jobs/:id  | Delete a job      |

---

## 🔧 Troubleshooting

**"ANTHROPIC_API_KEY not configured"**  
→ Check your `backend/.env` file exists and has the key starting with `sk-ant-`

**CORS error in browser**  
→ Make sure backend runs on port 5000 and frontend on port 5173

**Port already in use**  
→ Change `PORT=5001` in `.env`, then update `vite.config.js` proxy target to `http://localhost:5001`

**"DB not initialized"**  
→ Always start the backend with `npm run dev` (not by running individual files)

---

## 🛠 Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18, Vite, React Router      |
| Backend  | Node.js, Express.js               |
| Database | SQLite via sql.js (pure JS)       |
| Auth     | JWT, bcryptjs                     |
| AI       | Anthropic Claude API              |
