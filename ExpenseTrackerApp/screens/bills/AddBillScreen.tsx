"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from "react-native"
import { TextInput, Button, Card, Switch } from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useExpense } from "../../contexts/ExpenseContext"
import { scheduleBillReminder } from "../../utils/notificationUtils"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import type { Bill } from "../.."

type BillsStackParamList = {
  BillsList: undefined
  AddBill: { bill?: Bill }
}

type AddBillScreenNavigationProp = StackNavigationProp<BillsStackParamList, "AddBill">
type AddBillScreenRouteProp = RouteProp<BillsStackParamList, "AddBill">

interface AddBillScreenProps {
  navigation: AddBillScreenNavigationProp
  route: AddBillScreenRouteProp
}

const AddBillScreen: React.FC<AddBillScreenProps> = ({ navigation, route }) => {
  const { addBill } = useExpense()
  const editingBill = route.params?.bill

  const [name, setName] = useState<string>(editingBill?.name || "")
  const [amount, setAmount] = useState<string>(editingBill?.amount?.toString() || "")
  const [dueDate, setDueDate] = useState<Date>(editingBill?.dueDate ? new Date(editingBill.dueDate) : new Date())
  const [isRecurring, setIsRecurring] = useState<boolean>(editingBill?.isRecurring || false)
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(editingBill?.reminderEnabled || true)
  const [notes, setNotes] = useState<string>(editingBill?.notes || "")
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = async (): Promise<void> => {
    if (!name || !amount) {
      Alert.alert("Error", "Please fill in name and amount")
      return
    }

    const billData = {
      name,
      amount: Number.parseFloat(amount),
      dueDate: dueDate.toISOString(),
      isRecurring,
      reminderEnabled,
      notes,
      isPaid: false,
    }

    try {
      setLoading(true)
      await addBill(billData)

      if (reminderEnabled) {
        await scheduleBillReminder({ ...billData, id: "temp", userId: "temp", createdAt: new Date().toISOString() })
      }

      Alert.alert("Success", "Bill added successfully")
      navigation.goBack()
    } catch (error) {
      Alert.alert("Error", "Failed to save bill")
    } finally {
      setLoading(false)
    }
  }

  const onDateChange = (event: any, selectedDate?: Date): void => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDueDate(selectedDate)
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.form}>
          <Text style={styles.title}>{editingBill ? "Edit Bill" : "Add New Bill"}</Text>

          <TextInput
            label="Bill Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Electricity, Rent, Netflix"
          />

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
            label="Due Date"
            value={dueDate.toLocaleDateString()}
            mode="outlined"
            style={styles.input}
            right={<TextInput.Icon icon="calendar" />}
            onFocus={() => setShowDatePicker(true)}
            showSoftInputOnFocus={false}
          />

          {showDatePicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Recurring Bill</Text>
            <Switch value={isRecurring} onValueChange={setIsRecurring} />
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Enable Reminders</Text>
            <Switch value={reminderEnabled} onValueChange={setReminderEnabled} />
          </View>

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
            {editingBill ? "Update Bill" : "Add Bill"}
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: "#2C3E50",
  },
  button: {
    paddingVertical: 8,
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 8,
  },
})

export default AddBillScreen
