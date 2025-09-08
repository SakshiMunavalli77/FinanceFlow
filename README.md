#  Finance Dashboard – React + Firebase + Chart.js

This is a personal **Finance Tracker Dashboard** built with React, Firebase, and Chart.js. It helps you track **income**, **expenses**, and **savings goals**, and visualizes your financial data using **interactive charts** (Pie + Bar).

---

## Features

- **Track Transactions:**  
  Easily add, categorize, and manage your income and expense transactions to keep a clear record of your finances.

- **Filter Transactions:**  
  Filter your transactions by month and category to analyze your spending habits in detail.

- **Visualize Data with Charts:**  
  - **Pie Chart:** Displays your expenses broken down by category for a quick snapshot of where your money goes.  
  - **Bar Chart:** Shows net cash flow (income minus expenses) per month, helping you understand your financial trends over time.

- **User Authentication:**  
  Secure login and signup using your email address, allowing you to keep your data private and synced across devices. (Powered by Firebase/Auth0 or your chosen auth system.)

- **Export Transactions:**  
  Export your transaction data as a CSV file, making it easy to analyze your finances in spreadsheet applications like Excel or Google Sheets or keep backups.

- **Savings Goals Tracking:**  
  Set personalized savings goals and monitor your progress to stay motivated and financially disciplined.

- **Responsive Design:**  
  The app is designed to work smoothly on desktops, tablets, and smartphones, ensuring accessibility wherever you go.

- **Future-ready:**  
  Modular and clean code architecture to easily add new features such as notifications, budget alerts, or bank API integration.

---

## 🚀 Tech Stack

- ⚛️ React
- 🔥 Firebase (Auth + Firestore)
- 📊 Chart.js + react-chartjs-2
- 💅 CSS Flexbox
- ☁️ Optional: Deploy to Vercel or Netlify

---

## Project Structure

financely/
│
├── public/ 
├── src/ 
│ ├── assets/ 
│ ├── components/ 
│ │ ├── Button/
│ │ ├── Cards/
│ │ ├── ChartComponent/
│ │ ├── Header/
│ │ ├── Input/
│ │ ├── Modals/
│ │ ├── NoTransactions.js
│ │ ├── SavingsGoals/
│ │ ├── SignupSignin/
│ │ └── TransactionsTable/
│ ├── pages/ 
│ ├── App.js 
│ ├── index.js 
│ └── index.css
├── .gitignore 
├── package.json 
├── README.md 

---

##  Setup Instructions

### 📁 Clone the Repo

```bash
git clone https://github.com/SakshiMunavalli77/FinanceFlow.git
cd FinanceFlow


---

