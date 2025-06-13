// screens/expenses/ExpensesScreen.tsx

"use client"

import type React from "react"
import { useState } from "react"
import { View, FlatList, StyleSheet } from "react-native"
import { FAB, Searchbar } from "react-native-paper"
import { useExpense } from "../../contexts/ExpenseContext"
import ExpenseCard from "../../components/common/ExpenseCard" // Adjust the path if necessary
import type { StackNavigationProp } from "@react-navigation/stack"
import type { Expense } from "../../types"; // Updated import path

type ExpenseStackParamList = {
  ExpensesList: undefined;
  AddExpense: { expense?: Expense };
}

type ExpensesScreenNavigationProp = StackNavigationProp<ExpenseStackParamList, "ExpensesList">

interface ExpensesScreenProps {
  navigation: ExpensesScreenNavigationProp;
}

const ExpensesScreen: React.FC<ExpensesScreenProps> = ({ navigation }) => {
  const { expenses } = useExpense();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredExpenses = expenses.filter(
    (expense: Expense) =>
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderExpense = ({ item }: { item: Expense }) => (
    <ExpenseCard 
      expense={item} 
      onPress={() => navigation.navigate("AddExpense", { expense: item })} 
    />
  );

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search expenses..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredExpenses}
        renderItem={renderExpense}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <FAB 
        style={styles.fab} 
        icon="plus" 
        onPress={() => navigation.navigate("AddExpense", {})} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  searchbar: {
    margin: 16,
  },
  list: {
    paddingBottom: 80,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#3498DB",
  },
});

export default ExpensesScreen;