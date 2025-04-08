Private Energy Provider – Global Energy Dashboard

This full-stack web application visualizes global energy consumption and generation data with interactive charts, AI-powered chat insights, and secure user authentication. Built with **React + FastAPI**, the app is fully Dockerized and deployable via AWS or Render.

Live Demo

Frontend (AWS Amplify):  
🔗 [https://main.d2mzhjetghav6s.amplifyapp.com](https://main.d2mzhjetghav6s.amplifyapp.com)

Test credentials:
```
Email: test3@gmail.com  
Password: Test@12345
```

---

Tech Stack

| Layer        | Tech Used                                                                 |
|--------------|---------------------------------------------------------------------------|
| Frontend     | React, TypeScript, Tailwind, Vite, Chart.js, React Router                 |
| Backend      | FastAPI, Uvicorn, Docker                                                  |
| Auth         | JWT, React Context, LocalStorage                                          |
| AI Assistant | OpenAI GPT-4 API + Prompt Engineering                                     |
| Database     | MongoDB Atlas                                                             |
| DevOps       | Docker, AWS Amplify, Render, GitHub Actions (CI/CD ready)                |

---

##  Local Setup Instructions

###  Clone the repo

```bash
git clone https://github.com/AkshayDaundkar/PrivateEnergyProviderAssesment.git
cd PrivateEnergyProviderAssesment
```

---

##  Frontend Setup (Vite + React)

```bash
cd frontend
npm install --force
npm run dev
```

> Frontend runs on: [http://localhost:5173](http://localhost:5173)

---

##  Backend Setup (FastAPI + Uvicorn)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

> Backend runs on: [http://localhost:8000](http://localhost:8000)

---

##  Run Full App with Docker (Optional)

Ensure Docker is installed: [Download Docker](https://www.docker.com/get-started)

###  Build and run locally:

```bash
docker build -t pep-backend ./backend
docker run -p 8000:8000 pep-backend
```

Or use Docker Compose if you have both frontend and backend containerized.

---

##  API Endpoints

| Route           | Method | Description                      |
|------------------|--------|----------------------------------|
| `/register`      | POST   | Register a new user              |
| `/login`         | POST   | Authenticate user, return token |
| `/energy-summary`| GET    | Fetch energy summary             |
| `/energy-data`   | GET    | Get chart data                   |
| `/query`         | POST   | AI Insight with OpenAI           |

---

##  Features

- Secure login & registration (JWT + MongoDB)
- Visual charts (Line, Radar, Bar, Pie, Bubble)
- Country/year filters with AI-powered chat
- Dockerfile for backend + Amplify deployment for frontend
- Responsive design for mobile & desktop




##  Connect

**Akshay Daundkar**  
📧 akshaydaundkar01@gmail.com  
🔗 [GitHub](https://github.com/AkshayDaundkar) | [LinkedIn](https://linkedin.com/in/akshay-daundkar)

```
