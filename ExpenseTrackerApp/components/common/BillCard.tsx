import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { Card, Button } from "react-native-paper"
import { formatCurrency } from "../../utils/currencyUtils"
import { formatDate, daysBetween } from "../../utils/dateUtils"
import type { Bill } from "../../types"

interface BillCardProps {
  bill: Bill
  onPress?: () => void
  onMarkPaid: (billId: string) => void
}

const BillCard: React.FC<BillCardProps> = ({ bill, onPress, onMarkPaid }) => {
  const getDaysUntilDue = (): number => {
    const today = new Date()
    const dueDate = new Date(bill.dueDate)
    return daysBetween(today, dueDate)
  }

  const getStatusColor = (): string => {
    if (bill.isPaid) return "#27AE60"

    const daysUntil = getDaysUntilDue()
    if (daysUntil <= 0) return "#E74C3C" // Overdue
    if (daysUntil <= 3) return "#F39C12" // Due soon
    return "#3498DB" // Normal
  }

  const getStatusText = (): string => {
    if (bill.isPaid) return "Paid"

    const daysUntil = getDaysUntilDue()
    if (daysUntil <= 0) return "Overdue"
    if (daysUntil <= 3) return `Due in ${daysUntil} days`
    return `Due in ${daysUntil} days`
  }

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={styles.card}>
        <View style={styles.cardContent}>
          <View style={styles.leftSection}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
            <View style={styles.billInfo}>
              <Text style={styles.name}>{bill.name}</Text>
              <Text style={styles.dueDate}>Due: {formatDate(bill.dueDate)}</Text>
              <Text style={[styles.status, { color: getStatusColor() }]}>{getStatusText()}</Text>
            </View>
          </View>
          <View style={styles.rightSection}>
            <Text style={styles.amount}>{formatCurrency(bill.amount)}</Text>
            {!bill.isPaid && (
              <Button mode="contained" compact onPress={() => onMarkPaid(bill.id)} style={styles.payButton}>
                Mark Paid
              </Button>
            )}
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
  statusIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  billInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 2,
  },
  dueDate: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: "500",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  payButton: {
    backgroundColor: "#27AE60",
  },
})

export default BillCard
