"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from "react-native"
import { TextInput, Button, Card } from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useExpense } from "../../contexts/ExpenseContext"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import type { Income } from "../../types"

type IncomeStackParamList = {
  IncomeList: undefined
  AddIncome: { income?: Income }
}

type AddIncomeScreenNavigationProp = StackNavigationProp<IncomeStackParamList, "AddIncome">
type AddIncomeScreenRouteProp = RouteProp<IncomeStackParamList, "AddIncome">

interface AddIncomeScreenProps {
  navigation: AddIncomeScreenNavigationProp
  route: AddIncomeScreenRouteProp
}

const AddIncomeScreen: React.FC<AddIncomeScreenProps> = ({ navigation, route }) => {
  const { addIncome } = useExpense()
  const editingIncome = route.params?.income

  const [amount, setAmount] = useState<string>(editingIncome?.amount?.toString() || "")
  const [source, setSource] = useState<string>(editingIncome?.source || "")
  const [date, setDate] = useState<Date>(editingIncome?.date ? new Date(editingIncome.date) : new Date())
  const [notes, setNotes] = useState<string>(editingIncome?.notes || "")
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (): Promise<void> => {
    if (!amount || !source) {
      Alert.alert("Error", "Please fill in amount and source")
      return
    }

    const incomeData = {
      amount: Number.parseFloat(amount),
      source,
      date: date.toISOString(),
      notes,
    }

    try {
      setLoading(true)
      await addIncome(incomeData)
      Alert.alert("Success", "Income added successfully")
      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", "Failed to save income")
    } finally {
      setLoading(false)
    }
  }

  const onDateChange = (event: any, selectedDate?: Date): void => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.form}>
          <Text style={styles.title}>{editingIncome ? "Edit Income" : "Add New Income"}</Text>

          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            left={<TextInput.Icon icon="currency-usd" />}
          />

          <TextInput
            label="Source"
            value={source}
            onChangeText={setSource}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Salary, Freelance, Investment"
          />

          <TextInput
            label="Date"
            value={date.toLocaleDateString()}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Icon icon="calendar" />}
            onFocus={() => setShowDatePicker(true)}
            showSoftInputOnFocus={false}
          />

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}

          <TextInput
            label="Notes (Optional)"
            value={notes}
            onChangeText={setNotes}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
          />

          <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading} style={styles.button}>
            {editingIncome ? "Update Income" : "Add Income"}
          </Button>

          <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton}>
            Cancel
          </Button>
        </View>
      </Card>
    </ScrollView>
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
  },
  form: {
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "white",
  },
  button: {
    paddingVertical: 8,
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 8,
  },
})

export default AddIncomeScreen
