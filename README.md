# Chattify 💬⚡  
A real-time chat application built using the **MERN stack** and **Socket.io**, designed for seamless one-on-one and group communication. With features like typing indicators, real-time syncing, and group management, Chattify delivers a smooth modern messaging experience.

## 🚀 Features

### 🧑‍🤝‍🧑 Real-Time Chat
- 🔒 **Private (1-on-1)** chat between authenticated users
- 👥 **Group chat** support with add/remove member capability
- 💬 **Live messaging** using Socket.io
- ✍️ **Typing indicators** ("User is typing…")
- 🔄 Real-time **message syncing** across all clients
- 🟢 **Online status** indicators (optional)

### 🛂 Authentication & Authorization
- JWT-based secure login & signup
- Protected chat routes
- Role-based group access control (e.g., only group admin can remove members)

### 📥 Message Management
- Store messages in MongoDB
- Group and private chat history saved and fetched
- Show latest messages on sidebar/chat list

### 📲 Responsive UI
- Clean UI built with **React.js** and **Tailwind CSS**
- Responsive layout for mobile and desktop

---

## 🛠️ Tech Stack

| Technology       | Purpose                         |
|------------------|----------------------------------|
| **MongoDB**      | Database                        |
| **Express.js**   | Backend APIs                    |
| **React.js**     | Frontend                        |
| **Node.js**      | Server runtime                  |
| **Socket.io**    | Real-time communication         |
| **JWT**          | Authentication                  |
| **Tailwind CSS** | Styling                         |
| **Redux Toolkit** _(optional)_ | Global state      |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/chattify.git
cd chattify

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
