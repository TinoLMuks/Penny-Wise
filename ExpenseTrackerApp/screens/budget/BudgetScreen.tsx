import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Card } from "react-native-paper"

const BudgetScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Budget Management</Text>
        <Text style={styles.subtitle}>Coming Soon!</Text>
        <Text style={styles.description}>
          Set budgets for different categories and track your spending against them.
        </Text>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
  },
  card: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#7F8C8D",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#95A5A6",
    textAlign: "center",
  },
})

export default BudgetScreen
