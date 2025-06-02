import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Card } from "react-native-paper"
import { formatCurrency } from "../../utils/currencyUtils"
import { formatDate } from "../../utils/dateUtils"
import type { Expense } from "../../types"

interface ExpenseCardProps {
  expense: Expense
  onPress?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress, onEdit, onDelete }) => {
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "food & dining": "#FF6B6B",
      transportation: "#4ECDC4",
      entertainment: "#45B7D1",
      "bills & utilities": "#96CEB4",
      shopping: "#FFEAA7",
      healthcare: "#DDA0DD",
      education: "#74B9FF",
      travel: "#FD79A8",
      other: "#95A5A6",
    }
    return colors[category.toLowerCase()] || colors.other
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.leftSection}>
            <View style={[styles.categoryIndicator, { backgroundColor: getCategoryColor(expense.category) }]} />
            <View style={styles.expenseInfo}>
              <Text style={styles.description}>{expense.description}</Text>
              <Text style={styles.category}>{expense.category}</Text>
              <Text style={styles.date}>{formatDate(expense.date)}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.amount}>{formatCurrency(expense.amount)}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
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
    flexDirection: "row",
    alignItems: "center",
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  expenseInfo: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 2,
  },
  category: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: "#95A5A6",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E74C3C",
  },
})

export default ExpenseCard
