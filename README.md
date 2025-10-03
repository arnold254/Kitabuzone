# 📚 KitabuZone  
An **online book lending and buying application** where users can explore books, borrow them from the library, or purchase them from the store. Admins can manage inventory, while customers enjoy a seamless digital reading marketplace.  

## Live Demo

- **Frontend (React App):** [Live Link](https://kitabuzone-ktpc.onrender.com/)
- **Backend (Flask API):** [API Link](https://kitabuzone.onrender.com)


---

## 🌟 Features
- 🔑 **Authentication & Authorization** (JWT-based login, roles: Admin, Customer).  
- 📖 **Browse Books** (filter by price, categories).  
- 🛒 **Borrow & Purchase Flows** with separate carts.  
- 📤 **Book Upload** with cover image support (by Admin).  
- 👨‍💼 **Admin Panel** to manage users and book inventory.  
- 🟣 **Modern UI** with React, TailwindCSS, and context-based state management.  

---

## 📂 Project Structure

```bash
.
├── LICENSE
├── README.md
├── backend
│   ├── Pipfile
│   ├── Pipfile.lock
│   ├── app
│   ├── app.db
│   ├── database_contents.txt
│   ├── database_contents_updated.txt
│   ├── database_contents_updated2.txt
│   ├── database_contents_updated3.txt
│   ├── dev.db
│   ├── generate_ids.py
│   ├── instance
│   ├── migrations
│   ├── requirements.txt
│   ├── sample_data.sql
│   ├── temp_data.sql
│   └── wsgi.py
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   ├── src
│   ├── tailwind.config.js
│   └── vite.config.js
└── render.yaml
```
---

## 🛠️ Technologies Used

### **Backend (Flask)**
- Flask, Flask-SQLAlchemy, Flask-Migrate  
- Flask-JWT-Extended (auth)  
- Flask-CORS (CORS support)  
- PostgreSQL (production DB on Render)  

### **Frontend (React)**
- React (Vite)  
- Axios (API calls)  
- TailwindCSS (UI styling)  
- React Router (navigation)  

### **Deployment**
- Render (Frontend + Backend)  
- PostgreSQL (Render managed database)  

---

## ⚙️ Setup Instructions

### **1. Clone Repo**
```bash
git clone https://github.com/arnold254/Kitabuzone.git
cd Kitabuzone
```

### 2. Backend Setup

cd backend
- python -m venv venv
- source venv/bin/activate   # or venv\Scripts\activate on Windows
- pip install -r requirements.txt

# Initialize DB
- flask db upgrade
- flask run


### 3. Frontend Setup
- cd frontend
- npm install
- npm run dev


---

## 🔑 Authentication Flow



- Register / Login → JWT token issued.


- Token is stored in localStorage.


- On each API request, frontend sends Authorization: Bearer <token>.


- Backend validates token and checks role (admin, customer).


- Role-based access ensures only authorized users can manage books/orders.


---

## 📡 API Endpoints

### 1. Auth

- POST /auth/register → Register new user

- POST /auth/login → Login user, returns JWT

- GET /auth/me → Get current user

### 2. Books

- GET /books → Get all books

- GET /books/<id> → Get single book

- POST /books → (Admin/Supplier) Add book

- PATCH /books/<id> → (Admin/Supplier) Update book

- DELETE /books/<id> → (Admin) Remove book

### 3. Borrowing

- POST /borrow → Borrow a book

- GET /borrowed → Get borrowed books by user

- PATCH /borrow/<id>/return → Return a borrowed book

### 4. Store / Orders

- POST /cart → Add book to purchase cart

- GET /cart → View purchase cart

- POST /orders → Checkout

- GET /orders → Get orders (Admin can view all)


---
## 🚀 Deployment

### Frontend (React on Render)

- Build project:
```
npm run build
```

- Deploy via Render Static Site.

- Set Publish Directory to dist/.

### Backend (Flask on Render)

- Create Web Service on Render.

- Add environment variables:

- DATABASE_URL

- JWT_SECRET_KEY

- FLASK_ENV=production

- Use start command:
```
gunicorn 'wsgi:app' --bind 0.0.0.0:$PORT"
```

## 👥 Contributors
### Arnold & Mark
– Frontend development (React, UI/UX).

### George & Fatuma
– Backend development (Flask, API design).

### George, Arnold & Mark
– Testing, bug fixes, documentation.

## 📜 License

- This project is licensed under the `MIT License` 
