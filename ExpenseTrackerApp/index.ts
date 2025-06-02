import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);

export interface User {
  uid: string
  email: string
  displayName?: string
}

export interface Expense {
  id: string
  userId: string
  amount: number
  description: string
  category: string
  date: string
  notes?: string
  createdAt: string
}

export interface Income {
  id: string
  userId: string
  amount: number
  source: string
  date: string
  notes?: string
  createdAt: string
}

export interface Bill {
  id: string
  userId: string
  name: string
  amount: number
  dueDate: string
  isRecurring: boolean
  reminderEnabled: boolean
  isPaid: boolean
  paidDate?: string
  notes?: string
  createdAt: string
}

export interface Budget {
  id: string
  userId: string
  category: string
  amount: number
  period: "monthly" | "yearly"
  createdAt: string
}

export interface AuthContextType {
  currentUser: User | null
  signup: (email: string, password: string) => Promise<any>
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

export interface ExpenseContextType {
  expenses: Expense[]
  income: Income[]
  bills: Bill[]
  budgets: Budget[]
  loading: boolean
  addExpense: (expense: Omit<Expense, "id" | "userId" | "createdAt">) => Promise<void>
  addIncome: (income: Omit<Income, "id" | "userId" | "createdAt">) => Promise<void>
  addBill: (bill: Omit<Bill, "id" | "userId" | "createdAt">) => Promise<void>
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
}
