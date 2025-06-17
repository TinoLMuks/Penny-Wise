import { registerRootComponent } from 'expo';
import App from '../App';
import { User as FirebaseUser } from "firebase/auth";

registerRootComponent(App);

// User interface definition
export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

// Expense interface definition
export interface Expense {
  id: string;
  userId: string; // Added userId for tracking
  amount: number;
  description: string;
  category: string;
  date: string;
  notes?: string;
  createdAt: string; // Timestamp when the expense was created
}

// Income interface definition
export interface Income {
  id: string;
  userId: string; // Added userId for tracking
  amount: number;
  source: string;
  date: string;
  notes?: string;
  createdAt: string; // Timestamp when the income was created
}

// Bill interface definition
export interface Bill {
  id: string;
  userId: string; // Added userId for tracking
  name: string; 
  amount: number;
  dueDate: string;
  isRecurring: boolean;
  reminderEnabled: boolean;
  isPaid: boolean;
  paidDate?: string; // Optional date when the bill was paid
  notes?: string;
  createdAt: string; // Timestamp when the bill was created
}

// Budget interface definition
export interface Budget {
  id: string;
  userId: string; // Added userId for tracking
  category: string;
  amount: number;
  period: "monthly" | "yearly"; // Defines the frequency of the budget
  createdAt: string; // Timestamp when the budget was created
}

// Auth context interface definition
export interface AuthContextType {
  currentUser: FirebaseUser | null; // Current authenticated user
  signup: (email: string, password: string) => Promise<any>; // User signup method
  login: (email: string, password: string) => Promise<any>; // User login method
  logout: () => Promise<void>; // User logout method
  resetPassword: (email: string) => Promise<void>; // Password reset method
}

// Expense context interface definition
export interface ExpenseContextType {
  expenses: Expense[]; // Array of expenses
  income: Income[]; // Array of income records
  bills: Bill[]; // Array of bills
  budgets: Budget[]; // Array of budgets
  loading: boolean; // Loading state
  addExpense: (expense: Omit<Expense, "id" | "userId" | "createdAt">) => Promise<void>;
  addIncome: (income: Omit<Income, "id" | "userId" | "createdAt">) => Promise<void>;
  addBill: (bill: Omit<Bill, "id" | "userId" | "createdAt">) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
}