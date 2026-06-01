# 🚨 Smart Disaster Relief System (SDRS)

A centralized web-based platform for managing disaster relief operations — built with Flask, MongoDB, and vanilla JavaScript.

---

## 👥 Group Members

| # | Name | Roll No | Role |
|---|------|---------|------|
| 1 | Muhammad Talha Rauf | 242201014 | Backend — Flask routing, authentication, testing |
| 2 | Ahsan Mahmood | 242201009 | Database — MongoDB collections, PyMongo integration |
| 3 | Huzaifa Iqbal | 242201035 | Frontend — UI design, HTML/CSS pages |

**Submitted To:** Madam Asra Nadeem  
**Institution:** KICSIT — Kahuta Campus (Affiliated with Institute of Space Technology, Islamabad)

---

## 📌 Project Overview

Natural disasters create serious challenges for rescue teams — managing victim information, coordinating volunteers, tracking resources, and locating shelters all at once is extremely difficult with traditional manual systems.

SDRS solves this by providing a **single centralized system** where all disaster-related data is managed efficiently, helping authorities respond faster and save more lives.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🌪️ Disaster Management | Add, edit, delete disaster events with severity and status tracking |
| 🧑‍🤝‍🧑 Victim Management | Register victims, track missing/rescued status, store medical info |
| 🏠 Shelter Management | Manage shelter locations, capacity, occupancy, and facilities |
| 🙋 Volunteer Management | Register volunteers, assign duties, track deployment status |
| 💰 Donation Tracking | Record monetary and in-kind donations with utilization tracking |
| 📦 Resource Inventory | Manage food, medicine, equipment with stock level monitoring |
| 📊 Dashboard | Real-time overview of all operations with live statistics |
| 🔐 Authentication | Secure login/signup system with session management |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, Flask |
| Database | MongoDB (NoSQL) |
| DB Connectivity | PyMongo |
| Authentication | Flask Sessions, bcrypt |
| Dev Tools | VS Code, MongoDB Compass |

---

## 📁 Project Structure

```
smart-disaster-relief/
│
├── app.py                          # Flask application entry point
├── config.py                       # MongoDB connection
├── requirements.txt                # Python dependencies
├── .env                            # Secret keys (not pushed to git)
│
├── routes/                         # Backend route files
│   ├── __init__.py
│   ├── auth.py                     # Login, signup, logout
│   ├── disasters.py                # Disaster CRUD
│   ├── victims.py                  # Victim CRUD
│   ├── shelters.py                 # Shelter CRUD
│   ├── volunteers.py               # Volunteer CRUD
│   ├── donations.py                # Donation CRUD
│   └── resources.py                # Resource CRUD
│
├── templates/                      # HTML pages (Jinja2)
│   ├── welcome.html
│   ├── auth/
│   │   ├── login.html
│   │   └── signup.html
│   ├── dashboard/
│   │   └── index.html
│   ├── disasters/
│   │   ├── index.html
│   │   ├── form.html
│   │   └── update.html
│   ├── victims/
│   ├── shelters/
│   ├── volunteers/
│   ├── donations/
│   └── resources/
│
└── static/
    ├── stylesheet/
    │   └── style.css
    └── javascript/
        ├── dashboard.js
        ├── disasters.js
        ├── victims.js
        ├── shelter.js
        ├── volunteers.js
        ├── donation.js
        └── resources.js
```

---

## 🗄️ Database Collections

**Database name:** `disaster_relief_db`

| Collection | Description |
|------------|-------------|
| `users` | Admin accounts with hashed passwords and roles |
| `disasters` | Disaster events with type, location, severity, status |
| `victims` | Victim records with medical info and status |
| `shelters` | Shelter locations with capacity and occupancy |
| `volunteers` | Volunteer profiles with skills and assignment |
| `donations` | Donation records — monetary and in-kind |
| `resources` | Inventory items with stock levels and facility info |

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/talhaw-cmd/smart-disaster-relief.git
cd smart-disaster-relief
```

### 2. Install dependencies

```bash
pip install flask pymongo python-dotenv bcrypt
```

### 3. Configure MongoDB

Create a `config.py` file:

```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["disaster_relief_db"]
```

Or use MongoDB Atlas — replace the connection string with your Atlas URI.

### 4. Set secret key in `app.py`

```python
app.secret_key = "your_secret_key_here"
```

### 5. Run the application

```bash
python app.py
```

Open your browser and go to: `http://127.0.0.1:5000`

---

## 🔐 Authentication Flow

```
Signup → Password hashed with bcrypt → Stored in users collection
Login  → bcrypt verify → Session created → Dashboard access
Logout → Session cleared → Redirect to login
```

All routes are protected with `@login_required` decorator — unauthenticated users are redirected to login.

---

## 📊 MongoDB Concepts Used

- **NoSQL Document Design** — flexible schema for each collection
- **CRUD Operations** — full create, read, update, delete across all modules
- **Aggregation Framework** — used for dashboard stats (count, sum)
- **PyMongo** — database connectivity from Flask
- **Indexing** — on email field in users collection
- **Session-based Authentication** — Flask sessions with bcrypt hashing

---

## 🌐 API Routes Summary

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/signup` | Signup page |
| POST | `/useradded` | Register new user |
| GET | `/login` | Login page |
| POST | `/userverify` | Verify credentials |
| GET | `/logout` | Logout and clear session |

### Disasters
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/disaster` | List all disasters |
| GET | `/disasterdata` | JSON data for JS fetch |
| GET | `/adddisaster` | Add disaster form |
| POST | `/submitdisaster` | Save new disaster |
| GET | `/editdisaster/<id>` | Edit form (prefilled) |
| POST | `/updatedisaster/<id>` | Update disaster |
| GET | `/deletedisaster/<id>` | Delete disaster |

*Same pattern for victims, shelters, volunteers, donations, resources.*

---

## 👨‍💻 Development Roadmap Completed

- [x] MongoDB connection and Flask setup
- [x] Full CRUD for all 6 modules
- [x] User authentication with bcrypt
- [x] Session-based route protection
- [x] Dashboard with live stats from database
- [x] Aggregation framework for totals
- [x] Responsive UI with sidebar layout
- [x] Form validation (frontend + backend)
- [x] REST API routes using Flask

---

## 📝 License

This project was developed as an academic submission for the **Advanced Database Management Systems (ADBMS)** course at KICSIT — Institute of Space Technology, Islamabad.

---
