🧾 Inventory Management System
A full-stack inventory management system built with Spring Boot (Backend) and React.js (Frontend). It supports stock tracking, product movement, user roles, authentication, reporting, and much more.

📁 Project Structure
bash
Copy
Edit
inventorymanagement/
├── inventory/               # React frontend (client)
├── inventory-backend/       # Spring Boot backend (server)
└── README.md
🚀 Live Demo
🌐 Frontend (React): https://your-frontend-url.netlify.app

🔙 Backend (Spring Boot): https://your-backend-api-url.onrender.com

🛠️ Tech Stack
Backend – inventory-backend/
Java 17

Spring Boot

Spring Security (JWT Auth)

Spring Data JPA + Hibernate

PostgreSQL / MySQL

RESTful APIs

Frontend – inventory/
React.js

Axios

React Router

Context API / Redux (optional)

Chart.js / Recharts (for reports)

🔐 Features
✅ Authentication & Authorization
User login with JWT tokens

Role-based access control (Admin, Manager, Viewer)

📦 Inventory Features
Manage products with SKUs

Track stock levels

Log stock movements (in, out, transfer, etc.)

Auto-record stock history

📊 Reports & Notifications
Low stock / expired stock alerts

Stock movement reports with filters

Export to PDF / Excel

Pie charts and category-wise summaries

📂 How to Run Locally
1️⃣ Backend Setup
bash
Copy
Edit
cd inventory-backend
./mvnw clean install
./mvnw spring-boot:run
Configure DB in application.properties

API runs on: http://localhost:8080

2️⃣ Frontend Setup
bash
Copy
Edit
cd inventory
npm install
npm run dev
React runs on: http://localhost:5173

Ensure .env includes:

ini
Copy
Edit
VITE_API_URL=http://localhost:8080
☁️ Deployment
🔷 Frontend (Netlify)
Build: npm run build

Publish: dist/

🔶 Backend (Render)
Connect to GitHub repo

Start command: ./mvnw spring-boot:run

Set environment variables for DB and JWT

🙌 Author
Kayiranga Ernest
📍 Kigali, Rwanda
📧 kayinesta23@gmail.com
🔗 GitHub
🔗 LinkedIn

