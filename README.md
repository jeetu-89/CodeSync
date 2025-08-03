# 🧠 Collaborative C++ Code Editor

A real-time collaborative C++ code editor where users can create or join temporary rooms, write code together, and see the output—all powered by **React (Vite)** on the frontend and **WebSockets** on the backend.

## 🚀 Features

- 🔐 Temporary room creation and joining
- 📤 Share room ID with friends to collaborate
- 👥 Real-time updates when users join or leave the room
- 🧑‍💻 Collaborative C++ code editing
- ⚙️ Run C++ code and view output (executed on backend)
- 🔔 Toast notifications for user actions using `react-hot-toast`

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- WebSocket client
- react-hot-toast
- Monaco Editor

**Backend:**
- Node.js
- Express.js
- WebSocket 

## 📦 Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```


### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VITE_BACKEND_API=http://localhost:5000`


### Backend

```
cd backend
npm install
node server.js
```

## 📸 Screenshots

🏠 Room Creation
![Room Creation](https://github.com/VedantDewangan/Code-Sync/blob/main/frontend/src/assets/Screenshot%202025-08-03%20215936.png)

👨‍💻 Collaborative Coding
![Collaborative Editor](https://github.com/VedantDewangan/Code-Sync/blob/main/frontend/src/assets/Screenshot%202025-08-03%20220005.png)

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

## 📄 License

Licensed under the [MIT License](LICENSE).  
Feel free to use, modify, and share with attribution.

## 👨‍💻 Author
Built with ❤️ by Vedant Dewangan
