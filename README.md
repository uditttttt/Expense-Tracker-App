Markdown

# Expense Tracker - MERN Stack Application

A full-stack web application designed to help users manage their personal finances by tracking expenses and setting monthly budgets. This project is built with the MERN stack (MongoDB, Express, React, Node.js) and features a clean, responsive user interface.

---

## Live Demo

https://expense-tracker-app-frontend-mvtn.onrender.com/

---

## Features

This application is feature-rich and provides a complete user experience:

* **User Authentication:** Secure user registration and login system using JWT for authentication.
* **Expense Management (CRUD):** Full capabilities to Create, Read, Update, and Delete expenses.
* **Interactive Dashboard:** A central hub displaying:
    * **Monthly Summary:** Cards showing total spending and number of transactions.
    * **Data Visualization:** A dynamic doughnut chart breaking down expenses by category.
* **Budgeting System:**
    * Users can set monthly spending limits for each category.
    * Visual progress bars track spending against the set budgets in real-time.
* **Advanced Data Handling:**
    * **Filtering:** Filter expenses by category and date range (This Month, Last Month, This Year).
    * **Sorting:** Sort expenses by date or amount (ascending/descending).
    * **Pagination:** Efficiently handles a large number of expenses with "Next" and "Previous" page controls.
* **Modern UI/UX:**
    * Clean, responsive design built with Tailwind CSS.
    * User-friendly notifications (toasts) for all actions (add, edit, delete).
    * Visually appealing confirmation dialogs to prevent accidental deletions.

---

## Tech Stack

This project leverages a modern and powerful set of technologies:

**Frontend:**
* **React:** A JavaScript library for building user interfaces.
* **Vite:** A fast frontend build tool.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **React Router:** For client-side routing.
* **Axios:** For making API requests to the backend.
* **Chart.js & react-chartjs-2:** For data visualization.
* **React Hot Toast & SweetAlert2:** For modern notifications and dialogs.

**Backend:**
* **Node.js:** A JavaScript runtime environment.
* **Express:** A minimal and flexible Node.js web application framework.
* **MongoDB:** A NoSQL database for storing user and expense data.
* **Mongoose:** An ODM library for MongoDB to model application data.
* **JWT (JSON Web Tokens):** For securing API endpoints.

---

## Local Setup and Installation

To run this project on your local machine, follow these steps:

### Prerequisites
* Node.js installed
* npm or yarn installed
* MongoDB Atlas account or a local MongoDB server installed

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
2. Backend Setup
Bash

# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the 'backend' root and add the following variables:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
PORT=5000

# Run the backend server
npm run server
3. Frontend Setup
Bash

# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env.development file in the 'frontend' root and add your backend URL:
VITE_API_URL=http://localhost:5000/api

# Run the frontend development server
npm run dev
The application should now be running locally. The frontend is typically available at http://localhost:5173.