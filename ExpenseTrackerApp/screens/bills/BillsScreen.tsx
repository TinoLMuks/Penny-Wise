"use client"

import type React from "react"
import { useState } from "react"
import { View, FlatList, StyleSheet, Alert } from "react-native"
import { FAB, Searchbar } from "react-native-paper"
import { useExpense } from "../../contexts/ExpenseContext"
import BillCard from "../../components/common/BillCard"
import { updateDoc, doc } from "firebase/firestore"
import { db } from "../../firebase"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { Bill } from "../.."

type BillsStackParamList = {
  BillsList: undefined
  AddBill: { bill?: Bill }
}

type BillsScreenNavigationProp = StackNavigationProp<BillsStackParamList, "BillsList">

interface BillsScreenProps {
  navigation: BillsScreenNavigationProp
}

const BillsScreen: React.FC<BillsScreenProps> = ({ navigation }) => {
  const { bills } = useExpense()
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredBills = bills.filter((bill: Bill) => bill.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleMarkPaid = async (billId: string): Promise<void> => {
    try {
      await updateDoc(doc(db, "bills", billId), {
        isPaid: true,
        paidDate: new Date().toISOString(),
      })
      Alert.alert("Success", "Bill marked as paid")
    } catch (error) {
      Alert.alert("Error", "Failed to update bill")
    }
  }

  const renderBill = ({ item }: { item: Bill }) => (
    <BillCard bill={item} onPress={() => navigation.navigate("AddBill", { bill: item })} onMarkPaid={handleMarkPaid} />
  )

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search bills..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredBills}
        renderItem={renderBill}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <FAB style={styles.fab} icon="plus" onPress={() => navigation.navigate("AddBill", {})} />
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#3498DB",
  },
})

export default BillsScreen
