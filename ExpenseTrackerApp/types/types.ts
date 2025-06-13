// src/models/types.ts

// Define the type for an Expense
export type Expense = {
  id?: string; // Optional, can be omitted for new expenses
  amount: number; // The amount of the expense
  description: string; // A brief description of the expense
  category: string; // The category of the expense (e.g., "Food", "Transport")
  date: string; // The date of the expense in ISO string format
  notes?: string; // Optional additional notes about the expense
};

// If you have other types, you can define them here as well
// Example for Income
export type Income = {
  id?: string; // Optional, can be omitted for new income
  amount: number; // The amount of the income
  source: string; // The source of the income (e.g., "Salary", "Freelance Work")
  date: string; // The date of the income in ISO string format
  notes?: string; // Optional additional notes about the income
};

// Example for Bill
export type Bill = {
  id?: string; // Optional, can be omitted for new bills
  amount: number; // The amount of the bill
  description: string; // A brief description of the bill
  dueDate: string; // The due date of the bill in ISO string format
  notes?: string; // Optional additional notes about the bill
};

// You can add more types as needed for your application