import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Cookies from "js-cookie";
import { Platform } from "react-native";

export default function Login({ navigation }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Novo estado para visibilidade da senha

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setUsername("");
    setPassword("");
    setEmail("");
    setErrorMessage("");
  };

  const handleSubmit = async () => {
    const url = isRegister
      ? "http://192.168.0.3:8000/register/"
      : "http://192.168.0.3:8000/login/";
    const data = isRegister
      ? { username, password, email }
      : { username, password };

    const csrfToken = Cookies.get("csrftoken");

    try {
      const response = await axios.post(url, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      });

      if (Platform.OS !== "web") {
        await SecureStore.setItemAsync("username", username);
      } else {
        localStorage.setItem("username", username);
      }
      navigation.navigate("dash");
    } catch (error) {
      const msg =
        error.response?.data?.error || "Erro ao autenticar. Tente novamente.";
      setErrorMessage(msg);
      Alert.alert("Erro", msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá,</Text>
      <Text style={styles.title}>
        {isRegister ? "Crie sua conta aqui" : "Seja bem vindo"}
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {isRegister && (
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>
      )}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword} // Controla a visibilidade da senha
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)} // Alterna o estado
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"} // Muda o ícone com base no estado
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <LinearGradient
          colors={["#A8B6FF", "#92EBFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {isRegister ? "Cadastrar" : "Entrar"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-facebook" size={24} color="#4267B2" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={toggleForm}>
        <Text style={styles.toggleText}>
          {isRegister
            ? "Já tem uma conta? Faça Login"
            : "Ainda não tem conta? Cadastre-se"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  greeting: {
    fontSize: 20,
    color: "#333",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  icon: {
    marginLeft: 15,
    marginRight: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 15, // Posiciona o ícone do olho à direita
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
    paddingRight: 40, // Adiciona espaço para o ícone do olho
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "40%",
    marginBottom: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    backgroundColor: "#FFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  toggleText: {
    fontSize: 14,
    color: "#666",
  },
});