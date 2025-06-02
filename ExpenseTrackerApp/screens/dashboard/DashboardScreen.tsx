"use client"

import type React from "react"
import { useMemo } from "react"
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native"
import { Card, FAB } from "react-native-paper"
import { PieChart } from "react-native-chart-kit"
import { useExpense } from "../../contexts/ExpenseContext"
import { formatCurrency, calculateTotal } from "../../utils/currencyUtils"
import { getMonthStart, getMonthEnd } from "../../utils/dateUtils"
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import type { Expense, Income, Bill } from "../.."

type MainTabParamList = {
  Dashboard: undefined
  Expenses: undefined
  Income: undefined
  Bills: undefined
  Reports: undefined
  Budget: undefined
  Settings: undefined
}

type DashboardScreenNavigationProp = BottomTabNavigationProp<MainTabParamList, "Dashboard">

interface DashboardScreenProps {
  navigation: DashboardScreenNavigationProp
}

interface ChartData {
  name: string
  amount: number
  color: string
  legendFontColor: string
  legendFontSize: number
}

const screenWidth = Dimensions.get("window").width

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { expenses, income, bills } = useExpense()

  const monthlyData = useMemo(() => {
    const monthStart = getMonthStart()
    const monthEnd = getMonthEnd()

    const monthlyExpenses = expenses.filter((expense: Expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= monthStart && expenseDate <= monthEnd
    })

    const monthlyIncome = income.filter((inc: Income) => {
      const incomeDate = new Date(inc.date)
      return incomeDate >= monthStart && incomeDate <= monthEnd
    })

    const totalExpenses = calculateTotal(monthlyExpenses)
    const totalIncome = calculateTotal(monthlyIncome)
    const balance = totalIncome - totalExpenses

    return {
      totalExpenses,
      totalIncome,
      balance,
      monthlyExpenses,
    }
  }, [expenses, income])

  const categoryData: ChartData[] = useMemo(() => {
    const categories: Record<string, number> = {}
    monthlyData.monthlyExpenses.forEach((expense: Expense) => {
      categories[expense.category] = (categories[expense.category] || 0) + expense.amount
    })

    const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"]

    return Object.entries(categories).map(([name, amount], index) => ({
      name,
      amount,
      color: colors[index % colors.length],
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }))
  }, [monthlyData.monthlyExpenses])

  const upcomingBills = useMemo(() => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    return bills.filter((bill: Bill) => {
      const dueDate = new Date(bill.dueDate)
      return !bill.isPaid && dueDate >= today && dueDate <= nextWeek
    })
  }, [bills])

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, styles.incomeCard]}>
            <Text style={styles.summaryLabel}>Monthly Income</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(monthlyData.totalIncome)}</Text>
          </Card>

          <Card style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryLabel}>Monthly Expenses</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(monthlyData.totalExpenses)}</Text>
          </Card>

          <Card style={[styles.summaryCard, styles.balanceCard]}>
            <Text style={styles.summaryLabel}>Balance</Text>
            <Text style={[styles.summaryAmount, { color: monthlyData.balance >= 0 ? "#27AE60" : "#E74C3C" }]}>
              {formatCurrency(monthlyData.balance)}
            </Text>
          </Card>
        </View>

        {/* Expense Categories Chart */}
        {categoryData.length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Expenses by Category</Text>
            <PieChart
              data={categoryData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Card>
        )}

        {/* Upcoming Bills */}
        {upcomingBills.length > 0 && (
          <Card style={styles.billsCard}>
            <Text style={styles.sectionTitle}>Upcoming Bills</Text>
            {upcomingBills.slice(0, 3).map((bill: Bill) => (
              <View key={bill.id} style={styles.billItem}>
                <View>
                  <Text style={styles.billName}>{bill.name}</Text>
                  <Text style={styles.billDue}>Due: {new Date(bill.dueDate).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.billAmount}>{formatCurrency(bill.amount)}</Text>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>

      <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate("Expenses")} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  incomeCard: {
    backgroundColor: "#E8F5E8",
  },
  expenseCard: {
    backgroundColor: "#FFE8E8",
  },
  balanceCard: {
    backgroundColor: "#E8F4FD",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  chartCard: {
    margin: 16,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
    textAlign: "center",
  },
  billsCard: {
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
  },
  billItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  billName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2C3E50",
  },
  billDue: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  billAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E74C3C",
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#3498DB",
  },
})

export default DashboardScreen
