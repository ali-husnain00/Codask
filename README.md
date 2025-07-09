# 🚀 Codask - Collaborative Code Editor & Project Management Platform

Codask is a full-stack web application that enables developers to **collaboratively code in real-time**, **chat**, and **track project progress** through tasks and team management — all in one place.

Built with the **MERN Stack** (MongoDB, Express, React, Node.js) + **Socket.io** for real-time communication.

---

## 🧠 Features

### 🔧 Core Functionalities

* 🧑‍💻 **Collaborative Code Editor** (Real-time)
* 💬 **Real-time Chat** for project communication
* 📁 **File creation** per project (supports multiple languages)
* ✅ **Task Assignment & Status Updates**
* 📊 **Project Progress Tracker** (based on task completion)

### 👥 User & Team Management

* 🔐 Register / Login / Logout with JWT Auth
* 👥 Role-based members (`Project Lead`, `Developer`)
* 📩 Invite users to projects via email
* 📬 Accept / Decline project invites

---

## 🏗️ Tech Stack

| Frontend                        | Backend             | Database          | Real-Time |
| ------------------------------- | ------------------- | ----------------- | --------- |
| React.js, Context API, AOS, CSS | Node.js, Express.js | MongoDB, Mongoose | Socket.io |

---

## 📂 Folder Structure

```
Codask/
│
├── frontend/       # React Frontend
│   ├── src/
│   └── ...
│
├── backend/        # Node.js Backend
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── ...
│
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
SECRET_KEY=your_jwt_secret_key
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

## 🚀 Deployment

When deploying:

* Update `CORS` and `cookie` settings:

```js
// Example for cookie
res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // ✅ set to true in production (HTTPS)
  sameSite: "none",    // ✅ required for cross-origin cookies
});
```

* Use services like:

  * **Frontend**: Vercel / Netlify
  * **Backend**: Render / Railway / Cyclic
  * **Database**: MongoDB Atlas

---

## 🙌 Acknowledgements

Big thanks to:

* [Socket.io](https://socket.io/)
* [MongoDB](https://www.mongodb.com/)
* [React](https://react.dev/)
* All open-source contributors that inspired parts of this system

---

## 🧑‍💻 Author

**Ali Husnain**
React.js Developer
🌍 [Portfolio](https://alihusnaindev.netlify.app/) | 👥 [GitHub](https://github.com/ali-husnain00)

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
