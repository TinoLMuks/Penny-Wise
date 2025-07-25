# 💰 Expense Tracker App

A comprehensive React Native expense tracking application built with Expo, TypeScript, Firebase, and React Native Paper. Track your income, expenses, bills, and get detailed financial reports with beautiful charts and analytics.

## 🚀 Features

### 📱 Core Functionality
- **User Authentication** - Secure login, registration, and password reset
- **Expense Management** - Add, edit, delete, and categorize expenses
- **Income Tracking** - Record and manage multiple income sources
- **Bill Management** - Track bills with due dates and payment status
- **Dashboard** - Overview with charts, summaries, and quick actions

### 📊 Analytics & Reports
- **Visual Charts** - Pie charts, line charts, and bar charts
- **Monthly/Yearly Reports** - Detailed financial analytics
- **Category Breakdown** - Expense distribution by categories
- **Trend Analysis** - 6-month income vs expense trends
- **Savings Rate** - Track your financial health

### 🔔 Smart Features
- **Bill Reminders** - Push notifications for upcoming bills
- **Recurring Bills** - Automatic bill tracking
- **Search & Filter** - Find transactions quickly
- **Data Export** - Export reports as CSV or JSON
- **Offline Support** - Works without internet connection

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **UI Library**: React Native Paper
- **Navigation**: React Navigation v6
- **Backend**: Firebase (Firestore, Authentication)
- **Charts**: React Native Chart Kit
- **Notifications**: Expo Notifications
- **Date Handling**: React Native DateTimePicker

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Git](https://git-scm.com/)
- [Firebase Account](https://firebase.google.com/)

## 🚀 Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/expense-tracker-app.git
cd expense-tracker-app
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Install Required Packages
\`\`\`bash
# Core navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs

# React Native dependencies
npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view

# Firebase
npm install firebase

# UI and Charts
npm install react-native-paper react-native-chart-kit react-native-vector-icons

# Utilities and dependencies
npm install @react-native-async-storage/async-storage
npm install @react-native-community/datetimepicker
npm install expo-notifications
npm install react-native-svg
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
   npm install react-native-reanimated react-native-gesture-handler react-native-screens
   npm install react-native-safe-area-context @react-native-async-storage/async-storage
   npm install react-native-chart-kit react-native-svg react-native-calendars
   npm install react-native-paper react-native-vector-icons
   npm install axios formik yup moment

# TypeScript types
npm install --save-dev @types/react @types/react-native
\`\`\`

### 4. Firebase Setup

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication and Firestore Database

2. **Configure Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication

3. **Setup Firestore Database**
   - Go to Firestore Database
   - Create database in test mode
   - Set up the following collections:
     - `expenses`
     - `income`
     - `bills`
     - `budgets`

4. **Get Firebase Configuration**
   - Go to Project Settings > General
   - Add a new web app
   - Copy the configuration object

5. **Update Firebase Config**
   \`\`\`typescript
   // firebase.ts
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id",
   }
   \`\`\`

### 5. Configure Expo
\`\`\`bash
# Initialize Expo (if not already done)
expo init --template blank-typescript

# Install Expo dependencies
expo install expo-notifications expo-constants expo-device
\`\`\`

## 🏃‍♂️ Running the App

### Development Mode
\`\`\`bash
# Start the Expo development server
expo start
npx expo start

# Or use npm
npm start
\`\`\`

### Platform-specific Commands
\`\`\`bash
# Run on iOS simulator
expo start --ios

# Run on Android emulator
expo start --android

# Run on web
expo start --web
\`\`\`

## 📁 Project Structure

\`\`\`
ExpenseTrackerApp/
├── components/
│   ├── common/
│   │   ├── ExpenseCard.tsx
│   │   └── BillCard.tsx
│   ├── expenses/
│   │   ├── ExpenseList.tsx
│   │   ├── ExpenseForm.tsx
│   │   └── ExpenseFilter.tsx
│   ├── income/
│   │   ├── IncomeList.tsx
│   │   └── IncomeForm.tsx
│   ├── bills/
│   │   ├── BillList.tsx
│   │   └── BillForm.tsx
│   └── reports/
│       ├── ChartCard.tsx
│       └── SummaryCard.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── ExpenseContext.tsx
├── navigation/
│   └── AppNavigator.tsx
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── ForgotPasswordScreen.tsx
│   ├── dashboard/
│   │   └── DashboardScreen.tsx
│   ├── expenses/
│   │   ├── ExpensesScreen.tsx
│   │   └── AddExpenseScreen.tsx
│   ├── income/
│   │   ├── IncomeScreen.tsx
│   │   └── AddIncomeScreen.tsx
│   ├── bills/
│   │   ├── BillsScreen.tsx
│   │   └── AddBillScreen.tsx
│   ├── reports/
│   │   └── ReportsScreen.tsx
│   ├── budget/
│   │   └── BudgetScreen.tsx
│   └── settings/
│       └── SettingsScreen.tsx
├── services/
│   ├── auth.ts
│   ├── expenses.ts
│   ├── income.ts
│   ├── bills.ts
│   └── reports.ts
├── types/
│   └── index.ts
├── utils/
│   ├── currencyUtils.ts
│   ├── dateUtils.ts
│   └── notificationUtils.ts
├── firebase.ts
├── App.tsx
└── README.md
\`\`\`
