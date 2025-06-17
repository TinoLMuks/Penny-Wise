"use client"

import type React from "react"
import { useState } from "react"
import { View, FlatList, StyleSheet } from "react-native"
import { FAB, Searchbar, Card, Text } from "react-native-paper"
import { useExpense } from "../../contexts/ExpenseContext"
import { formatCurrency } from "../../utils/currencyUtils"
import { formatDate } from "../../utils/dateUtils"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { Income } from "../../types"

type IncomeStackParamList = {
  IncomeList: undefined
  AddIncome: { income?: Income }
}

type IncomeScreenNavigationProp = StackNavigationProp<IncomeStackParamList, "IncomeList">

interface IncomeScreenProps {
  navigation: IncomeScreenNavigationProp
}

const IncomeScreen: React.FC<IncomeScreenProps> = ({ navigation }) => {
  const { income } = useExpense()
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredIncome = income.filter((inc: Income) => inc.source.toLowerCase().includes(searchQuery.toLowerCase()))

  const renderIncome = ({ item }: { item: Income }) => (
    <Card style={styles.card} onPress={() => navigation.navigate("AddIncome", { income: item })}>
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View style={styles.incomeInfo}>
            <Text style={styles.source}>{item.source}</Text>
            <Text style={styles.date}>{formatDate(item.date)}</Text>
            {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
          </View>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
        </View>
      </View>
    </Card>
  )

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search income..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredIncome}
        renderItem={renderIncome}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate("AddIncome", {})} />
    </View>
  )
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
  card: {
    marginVertical: 4,
    marginHorizontal: 16,
    elevation: 2,
  },
  cardContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
  },
  incomeInfo: {
    flex: 1,
  },
  source: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#95A5A6",
    marginBottom: 2,
  },
  notes: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#27AE60",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#3498DB",
  },
})

export default IncomeScreen
