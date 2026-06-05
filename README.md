📒 Expense Tracker – Full Stack Web Application

🧩 Project Overview

This is a full-stack Expense Tracker application built to help users manage daily expenses in a simple and structured way. Users can add, update, and delete expenses, categorize spending, and track their financial habits using charts and summary insights. The application also includes budget tracking and visual analytics to help users understand where their money is going.

The project demonstrates practical implementation of CRUD operations, REST APIs, database handling using SQLite, and frontend-backend integration using React and Node.js.

🌐 Live Demo
Frontend: https://expense-tracker-fullstack-nih.vercel.app
Backend API: https://expense-tracker-api-ljzp.onrender.com
⚙️ Tech Stack

I chose this stack to keep the application lightweight, fast, and easy to deploy:

React.js – For building interactive UI components
Vite – For fast frontend development and optimized build
Tailwind CSS – For responsive and clean UI design
Recharts – To visualize expense data in charts
Axios – For API communication between frontend and backend
Node.js + Express.js – For backend REST API development
SQLite (better-sqlite3) – Lightweight database for storing expenses
Render + Vercel – For deployment of backend and frontend
🚀 How to Run This Project Locally
1. Clone the repository
git clone https://github.com/Niharika865/Expense-Tracker-Fullstack.git
cd Expense-Tracker-Fullstack
2. Setup Backend
cd server
npm install

Create a .env file:

PORT=5000

Start backend:

npm start

Backend runs at:

http://localhost:5000
3. Setup Frontend
cd client
npm install
npm run dev

Frontend runs at:

http://localhost:5173
📡 API Endpoints

Base URL:

https://expense-tracker-api-ljzp.onrender.com/api/expenses
Get all expenses

GET /

Add expense

POST /

Update expense

PUT /:id

Delete expense

DELETE /:id

Summary data

GET /summary

📁 Project Structure
Expense-Tracker-Fullstack/
│
├── client/        # React frontend (UI, charts, pages)
├── server/        # Node.js backend (API, DB, routes)
└── README.md
🔮 Future Improvements

If I continue improving this project, I would like to add:

User authentication (login/signup)
Multi-user expense tracking
Monthly budget alerts
Export report as PDF/Excel
Dark mode support
Advanced analytics with trends and predictions
💡 Key Learnings

While building this project, I focused on:

Structuring a full-stack application properly
Connecting frontend with REST APIs
Handling state and data visualization in React
Deploying frontend and backend separately
Managing environment variables for production