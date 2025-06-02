"use client"

import type React from "react"
import { View, Text, StyleSheet, Alert } from "react-native"
import { Card, Button, List } from "react-native-paper"
import { useAuth } from "../../contexts/AuthContext"

const SettingsScreen: React.FC = () => {
  const { currentUser, logout } = useAuth()

  const handleLogout = async (): Promise<void> => {
    try {
      await logout()
    } catch (error) {
      Alert.alert("Error", "Failed to logout")
    }
  }

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Settings</Text>

        <List.Section>
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Email"
            description={currentUser?.email}
            left={(props) => <List.Icon {...props} icon="email" />}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Preferences</List.Subheader>
          <List.Item
            title="Currency"
            description="USD"
            left={(props) => <List.Icon {...props} icon="currency-usd" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Notifications"
            description="Enabled"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Data</List.Subheader>
          <List.Item
            title="Export Data"
            description="Download your data"
            left={(props) => <List.Icon {...props} icon="download" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Backup"
            description="Backup to cloud"
            left={(props) => <List.Icon {...props} icon="cloud-upload" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <Button mode="contained" onPress={handleLogout} style={styles.logoutButton} buttonColor="#E74C3C">
          Logout
        </Button>
      </Card>
    </View>
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
  logoutButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
})

export default SettingsScreen
