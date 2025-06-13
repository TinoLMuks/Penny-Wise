"use client"

import type React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { useAuth } from "../contexts/AuthContext"
import { Ionicons } from "@expo/vector-icons"

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"

// Main Screens
import DashboardScreen from "../screens/dashboard/DashboardScreen"
import ExpensesScreen from "../screens/expenses/ExpensesScreen"
import AddExpenseScreen from "../screens/expenses/AddExpenseScreen" // Fixed import name
import IncomeScreen from "../screens/income/IncomeScreen"
import AddIncomeScreen from "../screens/income/AddIncomeScreen"
import BillsScreen from "../screens/bills/BillsScreen"
import AddBillScreen from "../screens/bills/AddBillScreen"
import ReportsScreen from "../screens/reports/ReportsScreen"
import BudgetScreen from "../screens/budget/BudgetScreen"
import SettingsScreen from "../screens/settings/SettingsScreen"

// Types
import type { Expense, Income, Bill } from "../types";

// Define Stack and Tab Navigator Types
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
}

type ExpenseStackParamList = {
  ExpensesList: undefined;
  AddExpense: { expense?: Expense };
}

type IncomeStackParamList = {
  IncomeList: undefined;
  AddIncome: { income?: Income };
}

type BillsStackParamList = {
  BillsList: undefined;
  AddBill: { bill?: Bill };
}

type MainTabParamList = {
  Dashboard: undefined;
  Expenses: undefined;
  Income: undefined;
  Bills: undefined;
  Reports: undefined;
  Budget: undefined;
  Settings: undefined;
}

// Create Navigators
const Stack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const ExpenseStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="ExpensesList" component={ExpensesScreen} options={{ title: "Expenses" }} />
    <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: "Add Expense" }} />
  </Stack.Navigator>
);

const IncomeStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="IncomeList" component={IncomeScreen} options={{ title: "Income" }} />
    <Stack.Screen name="AddIncome" component={AddIncomeScreen} options={{ title: "Add Income" }} />
  </Stack.Navigator>
);

const BillsStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="BillsList" component={BillsScreen} options={{ title: "Bills" }} />
    <Stack.Screen name="AddBill" component={AddBillScreen} options={{ title: "Add Bill" }} />
  </Stack.Navigator>
);

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === "Dashboard") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Expenses") {
          iconName = focused ? "card" : "card-outline";
        } else if (route.name === "Income") {
          iconName = focused ? "trending-up" : "trending-up-outline";
        } else if (route.name === "Bills") {
          iconName = focused ? "receipt" : "receipt-outline";
        } else if (route.name === "Reports") {
          iconName = focused ? "bar-chart" : "bar-chart-outline";
        } else if (route.name === "Budget") {
          iconName = focused ? "pie-chart" : "pie-chart-outline";
        } else if (route.name === "Settings") {
          iconName = focused ? "settings" : "settings-outline";
        } else {
          iconName = "help-outline";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#3498DB",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Expenses" component={ExpenseStack} />
    <Tab.Screen name="Income" component={IncomeStack} />
    <Tab.Screen name="Bills" component={BillsStack} />
    <Tab.Screen name="Reports" component={ReportsScreen} />
    <Tab.Screen name="Budget" component={BudgetScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AppNavigator: React.FC = () => {
  const { currentUser } = useAuth();

  return <NavigationContainer>{currentUser ? <MainTabs /> : <AuthStack />}</NavigationContainer>;
}

export default AppNavigator;