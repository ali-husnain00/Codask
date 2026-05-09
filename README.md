# 🚀 Codask - Professional Collaborative Workspace & IDE

Codask is a production-grade, collaborative developer workspace designed for seamless real-time coding, project management, and team communication. Built for speed and developer experience, it combines a VS Code-like editing environment with integrated task tracking and live code execution.

---

## ✨ Features

### 🧑‍💻 Production-Grade IDE
*   **VS Code Experience:** Collapsible sidebar rail, tab-based file navigation, and a Midnight Slate professional theme.
*   **Judge0 Execution Engine:** Multi-language code execution (JS, Python, C++, Java) with full **stdin support** for testing logic.
*   **Live Web Preview:** Real-time HTML/CSS/JS rendering with a debounced injection engine—see changes as you type.
*   **Monaco Editor:** Industry-standard code editing with syntax highlighting and intelligent layout.

### 👥 Collaboration & Management
*   **Real-time Synchronization:** Collaborative coding powered by Socket.io for zero-latency updates.
*   **Integrated Project Chat:** Discuss features and bugs without leaving the workspace.
*   **Task & Progress Tracking:** Assign tasks, update statuses, and watch your project's progress bar move automatically.
*   **Team Control:** Invite developers via email and manage project roles (Project Lead vs. Developer).

---

## 🏗️ Tech Stack

| Frontend | Backend | Database | Real-Time |
| :--- | :--- | :--- | :--- |
| **React 18**, Monaco Editor | **Node.js**, Express.js | **MongoDB**, Mongoose | **Socket.io** |
| Tailwind CSS, Framer Motion | Judge0 API (Execution) | JWT (Auth) | Lucide Icons |

---

## 📂 Folder Structure

```text
Codask/
├── frontend/       # Vite + React Frontend
│   ├── src/
│   │   ├── pages/  # Dashboard, Editor, Projects
│   │   └── lib/    # API Clients & Utilities
│   └── ...
├── backend/        # Express.js Backend
│   ├── controllers/# Business logic
│   ├── routes/     # API Endpoints
│   ├── models/     # MongoDB Schemas
│   └── ...
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
CORS_ORIGINS=https://your-frontend.netlify.app,http://localhost:5173
RAPIDAPI_KEY=your_judge0_rapidapi_key
```

---

## 💠 Installation (Local Development)

### 1. Clone the Repo
```bash
git clone https://github.com/ali-husnain00/codask.git
cd codask
```

### 2. Setup Backend
```bash
cd backend
npm install
# Ensure .env is configured
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

> Now visit `http://localhost:5173` in your browser.

---

## 🚀 Deployment Notes

Codask is optimized for cross-site deployment (e.g., Netlify + Railway). 

*   **Secure Cookies:** The system automatically handles `SameSite: None` and `Secure` flags for cross-domain auth.
*   **Proxy Support:** Backend uses `trust proxy` to ensure secure headers work behind load balancers.
*   **CORS:** Ensure `CORS_ORIGINS` in your backend `.env` matches your deployed frontend URL exactly.

---

## 🙌 Acknowledgements
*   [Judge0](https://judge0.com/) for the powerful execution engine.
*   [Monaco Editor](https://microsoft.github.io/monaco-editor/) for providing the IDE core.
*   [Socket.io](https://socket.io/) for the seamless collaboration.

---

## 🧑‍💻 Author

**Ali Husnain**
🌍 [Portfolio](https://alihusnaindev.vercel.app) | 👥 [GitHub](https://github.com/ali-husnain00)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
