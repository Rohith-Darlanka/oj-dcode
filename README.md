Dcode

A modern, full-featured online judge built with the MERN stack, designed for solving coding problems, managing submissions, and receiving AI-powered code reviews. This project supports real-time code execution in multiple languages, admin problem management, and user analytics dashboards.

## 🌟 Live Demo

🔗 **Try it live**: [https://oj-project-lyart.vercel.app/](https://oj-frontend-rouge.vercel.app/)  
📽️ **Demo Video**: https://www.loom.com/share/87df332dcbc449e9b2d969e2a36c83d4

---

## 🏗 System Architecture

[Frontend - React]
       |
       v
[Main Backend - Node.js + Express]
       |
       v
[Runner Backend - Code Execution (Docker + EC2)]

---

## 📌 Features

- ✅ Solve coding problems in **C++**, **Python**, and **Java**
- 🧪 Automatic code evaluation with **hidden test cases**
- 🧠 AI Review system using **Gemini API**
- 🧑‍🏫 Admin dashboard to **add/edit/delete** problems
- 🗃 View **submission history** with verdicts and timestamps
- 🔐 **JWT Authentication** with HTTP-only cookies
- 🐳 **Dockerized compiler microservice** for secure execution
---

## 🧰 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS

### Backend
- Node.js & Express
- MongoDB Atlas
- JWT & bcrypt

### runner-backend
- Node.js (`child_process`)
- Docker (for isolated code execution)
- Deployed on AWS EC2 (Docker image via AWS ECR)

### AI Integration
- Google Generative AI (Gemini API)

---
🧠 AI Code Review
How it works:
1.User clicks “AI Review”
2.AI gives a review about the code.(gemini api)
