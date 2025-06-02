"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native"
import { Card, SegmentedButtons } from "react-native-paper"
import { LineChart, BarChart } from "react-native-chart-kit"
import { useExpense } from "../../contexts/ExpenseContext"
import { formatCurrency, calculateTotal } from "../../utils/currencyUtils"
import { getMonthStart, getMonthEnd } from "../../utils/dateUtils"
import type { Expense, Income } from "../.."

const screenWidth = Dimensions.get("window").width

const ReportsScreen: React.FC = () => {
  const { expenses, income } = useExpense()
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month")

  const reportData = useMemo(() => {
    const now = new Date()
    let startDate: Date
    let endDate: Date

    if (selectedPeriod === "month") {
      startDate = getMonthStart(now)
      endDate = getMonthEnd(now)
    } else {
      startDate = new Date(now.getFullYear(), 0, 1)
      endDate = new Date(now.getFullYear(), 11, 31)
    }

    const filteredExpenses = expenses.filter((expense: Expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= startDate && expenseDate <= endDate
    })

    const filteredIncome = income.filter((inc: Income) => {
      const incomeDate = new Date(inc.date)
      return incomeDate >= startDate && incomeDate <= endDate
    })

    const totalExpenses = calculateTotal(filteredExpenses)
    const totalIncome = calculateTotal(filteredIncome)

    // Category breakdown
    const categoryData: Record<string, number> = {}
    filteredExpenses.forEach((expense: Expense) => {
      categoryData[expense.category] = (categoryData[expense.category] || 0) + expense.amount
    })

    // Monthly trend data
    const monthlyData: { month: string; expenses: number; income: number }[] = []
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = getMonthStart(monthDate)
      const monthEnd = getMonthEnd(monthDate)

      const monthExpenses = expenses.filter((expense: Expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= monthStart && expenseDate <= monthEnd
      })

      const monthIncome = income.filter((inc: Income) => {
        const incomeDate = new Date(inc.date)
        return incomeDate >= monthStart && incomeDate <= monthEnd
      })

      monthlyData.unshift({
        month: monthDate.toLocaleDateString("en-US", { month: "short" }),
        expenses: calculateTotal(monthExpenses),
        income: calculateTotal(monthIncome),
      })
    }

    return {
      totalExpenses,
      totalIncome,
      categoryData,
      monthlyData,
      filteredExpenses,
      filteredIncome,
    }
  }, [expenses, income, selectedPeriod])

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  }

  const lineChartData = {
    labels: reportData.monthlyData.map((data) => data.month),
    datasets: [
      {
        data: reportData.monthlyData.map((data) => data.expenses),
        color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: reportData.monthlyData.map((data) => data.income),
        color: (opacity = 1) => `rgba(39, 174, 96, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Expenses", "Income"],
  }

  const categoryChartData = {
    labels: Object.keys(reportData.categoryData).slice(0, 5),
    datasets: [
      {
        data: Object.values(reportData.categoryData).slice(0, 5),
      },
    ],
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Financial Reports</Text>

        <SegmentedButtons
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          buttons={[
            { value: "month", label: "This Month" },
            { value: "year", label: "This Year" },
          ]}
          style={styles.segmentedButtons}
        />

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <Card style={[styles.summaryCard, styles.incomeCard]}>
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(reportData.totalIncome)}</Text>
          </Card>

          <Card style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(reportData.totalExpenses)}</Text>
          </Card>

          <Card style={[styles.summaryCard, styles.balanceCard]}>
            <Text style={styles.summaryLabel}>Net Balance</Text>
            <Text
              style={[
                styles.summaryAmount,
                { color: reportData.totalIncome - reportData.totalExpenses >= 0 ? "#27AE60" : "#E74C3C" },
              ]}
            >
              {formatCurrency(reportData.totalIncome - reportData.totalExpenses)}
            </Text>
          </Card>
        </View>

        {/* Trend Chart */}
        <Card style={styles.chartCard}>
          <Text style={styles.chartTitle}>6-Month Trend</Text>
          <LineChart
            data={lineChartData}
            width={screenWidth - 60}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Card>

        {/* Category Breakdown */}
        {Object.keys(reportData.categoryData).length > 0 && (
          <Card style={styles.chartCard}>
            <Text style={styles.chartTitle}>Top Expense Categories</Text>
            <BarChart
              data={categoryChartData}
              width={screenWidth - 60}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              yAxisLabel="$"
              yAxisSuffix=""
            />
          </Card>
        )}

        {/* Statistics */}
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Statistics</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Average Daily Expense:</Text>
            <Text style={styles.statValue}>
              {formatCurrency(reportData.totalExpenses / (selectedPeriod === "month" ? 30 : 365))}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Transactions:</Text>
            <Text style={styles.statValue}>
              {reportData.filteredExpenses.length + reportData.filteredIncome.length}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Largest Expense:</Text>
            <Text style={styles.statValue}>
              {reportData.filteredExpenses.length > 0
                ? formatCurrency(Math.max(...reportData.filteredExpenses.map((e) => e.amount)))
                : "$0.00"}
            </Text>
          </View>
        </Card>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  card: {
    margin: 16,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 20,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  chartCard: {
    marginBottom: 20,
    padding: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
    textAlign: "center",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsCard: {
    padding: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ECF0F1",
  },
  statLabel: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
})

export default ReportsScreen
