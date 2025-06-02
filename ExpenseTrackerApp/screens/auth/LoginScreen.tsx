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

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, "Login">

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const { login } = useAuth()

  const handleLogin = async (): Promise<void> => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      await login(email, password)
    } catch (error: any) {
      Alert.alert("Login Failed", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.content}>
        <Text style={styles.title}>Expense Tracker</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>

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

            <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading} style={styles.button}>
              Login
            </Button>

            <Button mode="text" onPress={() => navigation.navigate("ForgotPassword")} style={styles.textButton}>
              Forgot Password?
            </Button>

            <Button mode="text" onPress={() => navigation.navigate("Register")} style={styles.textButton}>
              Don't have an account? Sign up
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

export default LoginScreen
