# Sweetshop Application 🍬

A full-stack Sweetshop management application designed to streamline inventory, orders, and customer interactions. This project follows **Test-Driven Development (TDD)**, clean coding principles, Git best practices, and responsible AI usage.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Setup & Installation](#setup--installation)
   - [Backend](#backend)
   - [Frontend](#frontend)
5. [Testing](#testing)
6.[TestCreds](#testcreds)
6. [Screenshots](#screenshots)
7. [My AI Usage](#my-ai-usage)
8. [Git & Version Control Guidelines](#git--version-control-guidelines)
9. [License](#license)

---

## Project Overview
The Sweetshop Application allows users to:
- Browse a catalog of sweets with images and descriptions.
- Add items to cart and place orders.
- Admins can manage inventory (CRUD operations).
- Track orders and view order history.
- Generate basic sales reports.

The project emphasizes **clean, maintainable code**, **high test coverage**, and **responsible AI usage**.

---

## Features
- **User Roles:** Admin, Customer.
- **Inventory Management:** Create, Read, Update, Delete sweets.
- **Order Management:** Add to cart, place orders, view order history.
- **Responsive Design:** Desktop and mobile friendly.
- **TDD:** Backend fully covered with unit and integration tests.
- **Clean Coding:** SOLID principles, meaningful variable names, clear comments.

---

## Tech Stack
- **Backend:** Python, Flask, SQLite/MongoDB
- **Frontend:** React,Tailwind
- **Testing:** PyTest (or Jest for frontend)
- **Version Control:** Git

---

## Setup & Installation

### Backend
1. Clone the repository:
   ```bash
   git clone https://github.com/naveennekkanti1/Incubyte.git
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend server:
   ```bash
   python app.py
   ```
   Backend runs on [http://localhost:5000](http://localhost:5000)

### Frontend
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (if using React):
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm start
   ```
   Frontend runs on [http://localhost:3000](http://localhost:3000)

---

## Testing

Run the test suite to ensure all backend functionalities are working correctly:

```bash
pytest --cov=app
```

- All tests are written using Test-Driven Development (TDD) principles: Red → Green → Refactor.
- Aim for high coverage and meaningful test scenarios.
- Ensure both unit and integration tests pass before committing.

---


## TestCreds
```
- Admin
  - username: admin  password: Admin@123
-Test User
  - username: testuser password: Test@123

```
---

## Screenshots

> Replace these placeholders with your actual screenshots

- **Homepage**
- **Customer Dashboard**
- **Purchase History**
- **Admin Dashboard**
- **Login and Register**

**Folder structure suggestion:**
```
screenshots/
  Home.jpg
  Admin_dashboard.jpg
  admin_purchase_history.jpg
  customer_purchase_history.jpg
  Login.jpg
  register.jpg
```

---

## My AI Usage

I used AI tools to improve productivity while maintaining transparency and responsible use:

- **ChatGPT:** Assisted in brainstorming API endpoint structures, frontend layout ideas, and generating example test cases.
- **GitHub Copilot:** Generated boilerplate code for Flask routes and React components. All code was manually reviewed and customized.
- **Gemini:** Helped refine database schema design and optimize queries.

**Reflection:**  
AI tools accelerated initial development and test writing. However, manual verification, refactoring, and adherence to TDD and clean coding principles were crucial to ensure high-quality, maintainable code.


## Git & Version Control Guidelines

- Commit frequently with descriptive messages.
- Follow Red → Green → Refactor pattern for TDD commits.
- For AI-assisted commits, include co-author trailer:

```bash
git commit -m "feat: Implement product API routes

Used ChatGPT to generate initial boilerplate for CRUD routes, then manually added validation and testing.
Co-authored-by: ChatGPT <AI@users.noreply.github.com>"
```

---

## License

This project is licensed under the MIT License.  
See LICENSE for details.

---

> **Note:**  
> This project strictly follows TDD, Clean Code principles, responsible AI usage, and proper Git version control practices. All commits using AI are clearly marked with co-author trailers.
