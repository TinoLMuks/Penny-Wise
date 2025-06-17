"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from "react-native"
import { TextInput, Button, Card, Menu, Provider as PaperProvider } from "react-native-paper"
import DateTimePicker from "@react-native-community/datetimepicker"
import { useExpense } from "../../contexts/ExpenseContext"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"

// Define the Expense type in this file or import it from your types file
export type Expense = {
  id?: string; // Optional for new expenses
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string format
  notes?: string; // Optional
};

type ExpenseStackParamList = {
  ExpensesList: undefined;
  AddExpense: { expense?: Expense };
};

type AddExpenseScreenNavigationProp = StackNavigationProp<ExpenseStackParamList, "AddExpense">;
type AddExpenseScreenRouteProp = RouteProp<ExpenseStackParamList, "AddExpense">;

interface AddExpenseScreenProps {
  navigation: AddExpenseScreenNavigationProp;
  route: AddExpenseScreenRouteProp;
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Other",
];

console.log("AddExpenseScreen rendered");

const AddExpenseScreen: React.FC<AddExpenseScreenProps> = ({ navigation, route }) => {
  const { addExpense, updateExpense } = useExpense();
  const editingExpense = route.params?.expense; // This may be undefined

  const [amount, setAmount] = useState<string>(editingExpense?.amount?.toString() || "");
  const [description, setDescription] = useState<string>(editingExpense?.description || "");
  const [category, setCategory] = useState<string>(editingExpense?.category || categories[0]);
  const [date, setDate] = useState<Date>(editingExpense?.date ? new Date(editingExpense.date) : new Date());
  const [notes, setNotes] = useState<string>(editingExpense?.notes || "");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!amount || !description) {
      Alert.alert("Error", "Please fill in amount and description");
      return;
    }

    const expenseData = {
      amount: Number.parseFloat(amount),
      description,
      category,
      date: date.toISOString(),
      notes,
    };

    try {
      setLoading(true);
      if (editingExpense && editingExpense.id) {
        await updateExpense(editingExpense.id, expenseData);
        Alert.alert("Success", "Expense updated successfully");
      } else {
        await addExpense(expenseData);
        Alert.alert("Success", "Expense added successfully");
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save expense");
    } finally {
      setLoading(false);
    }
  };

 

  const onDateChange = (event: any, selectedDate?: Date): void => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <PaperProvider>
      <ScrollView style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.form}>
            <Text style={styles.title}>{editingExpense ? "Edit Expense" : "Add New Expense"}</Text>

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
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              style={styles.input}
            />

            <Menu
              visible={showCategoryMenu}
              onDismiss={() => setShowCategoryMenu(false)}
              anchor={
                <TextInput
                  label="Category"
                  value={category}
                  mode="outlined"
                  style={styles.input}
                  right={<TextInput.Icon icon="chevron-down" />}
                  onFocus={() => setShowCategoryMenu(true)}
                  showSoftInputOnFocus={false}
                />
              }
            >
              {categories.map((cat) => (
                <Menu.Item
                  key={cat}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryMenu(false);
                  }}
                  title={cat}
                />
              ))}
            </Menu>

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
              {editingExpense ? "Update Expense" : "Add Expense"}
            </Button>

            <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.cancelButton}>
              Cancel
            </Button>
          </View>
        </Card>
      </ScrollView>
    </PaperProvider>
  );
};

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
});

export default AddExpenseScreen;