"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, type ReactNode } from "react"
import { db } from "../firebase"
import { useAuth } from "./AuthContext"
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, onSnapshot } from "firebase/firestore"
import type { Expense, Income, Bill, Budget, ExpenseContextType } from ".."

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export const useExpense = (): ExpenseContextType => {
  const context = useContext(ExpenseContext)
  if (!context) {
    throw new Error("useExpense must be used within an ExpenseProvider")
  }
  return context
}

interface ExpenseState {
  expenses: Expense[]
  income: Income[]
  bills: Bill[]
  budgets: Budget[]
  loading: boolean
}

type ExpenseAction =
  | { type: "SET_EXPENSES"; payload: Expense[] }
  | { type: "SET_INCOME"; payload: Income[] }
  | { type: "SET_BILLS"; payload: Bill[] }
  | { type: "SET_BUDGETS"; payload: Budget[] }
  | { type: "SET_LOADING"; payload: boolean }

const expenseReducer = (state: ExpenseState, action: ExpenseAction): ExpenseState => {
  switch (action.type) {
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload }
    case "SET_INCOME":
      return { ...state, income: action.payload }
    case "SET_BILLS":
      return { ...state, bills: action.payload }
    case "SET_BUDGETS":
      return { ...state, budgets: action.payload }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

interface ExpenseProviderProps {
  children: ReactNode
}

export const ExpenseProvider: React.FC<ExpenseProviderProps> = ({ children }) => {
  const { currentUser } = useAuth()
  const [state, dispatch] = useReducer(expenseReducer, {
    expenses: [],
    income: [],
    bills: [],
    budgets: [],
    loading: false,
  })

  // Add expense
  const addExpense = async (expenseData: Omit<Expense, "id" | "userId" | "createdAt">) => {
    if (!currentUser) return

    try {
      await addDoc(collection(db, "expenses"), {
        ...expenseData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error adding expense:", error)
      throw error
    }
  }

  // Add income
  const addIncome = async (incomeData: Omit<Income, "id" | "userId" | "createdAt">) => {
    if (!currentUser) return

    try {
      await addDoc(collection(db, "income"), {
        ...incomeData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error adding income:", error)
      throw error
    }
  }

  // Add bill
  const addBill = async (billData: Omit<Bill, "id" | "userId" | "createdAt">) => {
    if (!currentUser) return

    try {
      await addDoc(collection(db, "bills"), {
        ...billData,
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error adding bill:", error)
      throw error
    }
  }

  // Update expense
  const updateExpense = async (id: string, expenseData: Partial<Expense>) => {
    try {
      await updateDoc(doc(db, "expenses", id), expenseData)
    } catch (error) {
      console.error("Error updating expense:", error)
      throw error
    }
  }

  // Delete expense
  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, "expenses", id))
    } catch (error) {
      console.error("Error deleting expense:", error)
      throw error
    }
  }

  // Listen to expenses
  useEffect(() => {
    if (!currentUser) return

    const q = query(collection(db, "expenses"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const expenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[]
      dispatch({ type: "SET_EXPENSES", payload: expenses })
    })

    return unsubscribe
  }, [currentUser])

  // Listen to income
  useEffect(() => {
    if (!currentUser) return

    const q = query(collection(db, "income"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const income = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Income[]
      dispatch({ type: "SET_INCOME", payload: income })
    })

    return unsubscribe
  }, [currentUser])

  // Listen to bills
  useEffect(() => {
    if (!currentUser) return

    const q = query(collection(db, "bills"), where("userId", "==", currentUser.uid), orderBy("dueDate", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bills = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Bill[]
      dispatch({ type: "SET_BILLS", payload: bills })
    })

    return unsubscribe
  }, [currentUser])

  const value: ExpenseContextType = {
    ...state,
    addExpense,
    addIncome,
    addBill,
    updateExpense,
    deleteExpense,
  }

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
}
