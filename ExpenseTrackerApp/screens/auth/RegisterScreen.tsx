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

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, "Register">

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { signup } = useAuth()

  const handleRegister = async (): Promise<void> => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters")
      return
    }

    try {
      setLoading(true)
      await signup(email, password)
      Alert.alert("Success", "Account created successfully!")
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us to track your expenses!</Text>

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

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={styles.button}
            >
              Create Account
            </Button>

            <Button mode="text" onPress={() => navigation.navigate("Login")} style={styles.textButton}>
              Already have an account? Sign in
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

export default RegisterScreen
