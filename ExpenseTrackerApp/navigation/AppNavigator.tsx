"use client"

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

// Main Screens
import DashboardScreen from "../screens/dashboard/DashboardScreen";
import ExpensesScreen from "../screens/expenses/ExpensesScreen";
import AddExpenseScreen from "../screens/expenses/AddExpenseScreen";
import IncomeScreen from "../screens/income/IncomeScreen";
import AddIncomeScreen from "../screens/income/AddIncomeScreen";
import BillsScreen from "../screens/bills/BillsScreen";
import AddBillScreen from "../screens/bills/AddBillScreen";
import ReportsScreen from "../screens/reports/ReportsScreen";
import BudgetScreen from "../screens/budget/BudgetScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";

// Define Stack and Tab Navigator Types
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

type ExpenseStackParamList = {
  ExpensesList: undefined;
  AddExpense: { expense?: any }; // Adjust type as needed
};

type IncomeStackParamList = {
  IncomeList: undefined;
  AddIncome: { income?: any }; // Adjust type as needed
};

type BillsStackParamList = {
  BillsList: undefined;
  AddBill: { bill?: any }; // Adjust type as needed
};

type MainTabParamList = {
  Dashboard: undefined;
  Expenses: undefined;
  Income: undefined;
  Bills: undefined;
  Reports: undefined;
  Budget: undefined;
  Settings: undefined;
};

// Create Navigators
const AuthStack = createStackNavigator<AuthStackParamList>();
const ExpenseStack = createStackNavigator<ExpenseStackParamList>();
const IncomeStack = createStackNavigator<IncomeStackParamList>();
const BillsStack = createStackNavigator<BillsStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator: React.FC = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const ExpenseNavigator: React.FC = () => (
  <ExpenseStack.Navigator>
    <ExpenseStack.Screen name="ExpensesList" component={ExpensesScreen} options={{ title: "Expenses" }} />
    <ExpenseStack.Screen name="AddExpense" component={AddExpenseScreen} options={{ title: "Add Expense" }} />
  </ExpenseStack.Navigator>
);

const IncomeNavigator: React.FC = () => (
  <IncomeStack.Navigator>
    <IncomeStack.Screen name="IncomeList" component={IncomeScreen} options={{ title: "Income" }} />
    <IncomeStack.Screen name="AddIncome" component={AddIncomeScreen} options={{ title: "Add Income" }} />
  </IncomeStack.Navigator>
);

const BillsNavigator: React.FC = () => (
  <BillsStack.Navigator>
    <BillsStack.Screen name="BillsList" component={BillsScreen} options={{ title: "Bills" }} />
    <BillsStack.Screen name="AddBill" component={AddBillScreen} options={{ title: "Add Bill" }} />
  </BillsStack.Navigator>
);

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        switch (route.name) {
          case "Dashboard":
            iconName = focused ? "home" : "home-outline";
            break;
          case "Expenses":
            iconName = focused ? "card" : "card-outline";
            break;
          case "Income":
            iconName = focused ? "trending-up" : "trending-up-outline";
            break;
          case "Bills":
            iconName = focused ? "receipt" : "receipt-outline";
            break;
          case "Reports":
            iconName = focused ? "bar-chart" : "bar-chart-outline";
            break;
          case "Budget":
            iconName = focused ? "pie-chart" : "pie-chart-outline";
            break;
          case "Settings":
            iconName = focused ? "settings" : "settings-outline";
            break;
          default:
            iconName = "help-outline";
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#3498DB",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Expenses" component={ExpenseNavigator} />
    <Tab.Screen name="Income" component={IncomeNavigator} />
    <Tab.Screen name="Bills" component={BillsNavigator} />
    <Tab.Screen name="Reports" component={ReportsScreen} />
    <Tab.Screen name="Budget" component={BudgetScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AppNavigator: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <NavigationContainer>
      {currentUser ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;