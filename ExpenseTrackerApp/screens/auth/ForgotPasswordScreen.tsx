"use client"

import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native"
import { TextInput, Button, Card } from "react-native-paper"
import { useAuth } from "../../contexts/AuthContext"
import type { StackNavigationProp } from "@react-navigation/stack"

type AuthStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
}

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, "ForgotPassword">

interface ForgotPasswordScreenProps {
  navigation: ForgotPasswordScreenNavigationProp
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { resetPassword } = useAuth()

  const handleResetPassword = async (): Promise<void> => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address")
      return
    }

    try {
      setLoading(true)
      await resetPassword(email)
      Alert.alert("Success", "Password reset email sent! Check your inbox.")
      navigation.navigate("Login")
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email to receive reset instructions</Text>

        <Card style={styles.card}>
          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleResetPassword}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Send Reset Email
            </Button>

            <Button mode="text" onPress={() => navigation.navigate("Login")} style={styles.textButton}>
              Back to Login
            </Button>
          </View>
        </Card>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2C3E50",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#7F8C8D",
    marginBottom: 32,
  },
  card: {
    padding: 20,
    elevation: 4,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "white",
  },
  button: {
    paddingVertical: 8,
    marginTop: 8,
  },
  textButton: {
    marginTop: 8,
  },
})

export default ForgotPasswordScreen;
