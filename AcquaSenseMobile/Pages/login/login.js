import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Serviço de armazenamento universal
const storage = {
  async setItem(key, value) {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  async getItem(key) {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async removeItem(key) {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export default function Login({ navigation }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState("email");
  const [resetEmail, setResetEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setUsername("");
    setPassword("");
    setEmail("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setErrorMessage("");
  };

  const storeAuthData = async (accessToken, refreshToken) => {
    try {
      await Promise.all([
        storage.setItem("auth_access_token", accessToken),
        storage.setItem("auth_refresh_token", refreshToken),
        storage.setItem("auth_username", username),
      ]);
      return true;
    } catch (error) {
      console.error("Erro ao armazenar tokens:", error);
      throw error;
    }
  };

  const validateRegisterFields = () => {
    if (!firstName.trim()) {
      setErrorMessage("Por favor, insira seu primeiro nome");
      return false;
    }
    if (!lastName.trim()) {
      setErrorMessage("Por favor, insira seu sobrenome");
      return false;
    }
    if (!phone.trim()) {
      setErrorMessage("Por favor, insira seu telefone");
      return false;
    }
    if (!/^\d+$/.test(phone)) {
      setErrorMessage("O telefone deve conter apenas números");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    const url = isRegister
      ? "http://127.0.0.1:8000/register/"
      : "http://127.0.0.1:8000/api/token/";

    const data = isRegister
      ? { 
        username, 
        first_name: firstName, 
        last_name: lastName, 
        phone,
        email, 
        password 
      }
      : { username, password };

    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "ReactNative" 
        },
      });

      if (isRegister) {
        Alert.alert("Sucesso", "Registro concluído! Fazendo login...");
        return handleLogin(username, password);
      }

      await handleLoginResponse(response.data);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/token/",
        { username, password },
        { headers: { "Content-Type": "application/json" } }
      );
      await handleLoginResponse(response.data);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleLoginResponse = async (authData) => {
    if (!authData.access || !authData.refresh) {
      throw new Error("Resposta de autenticação inválida");
    }

    await storeAuthData(authData.access, authData.refresh);

    if (Platform.OS === "web") {
      navigation.navigate("dash");
    } else {
      navigation.navigate("dash");
    }
  };

  const handleAuthError = (error) => {
    console.error("Erro de autenticação:", error);

    let errorMessage = "Erro ao autenticar. Tente novamente.";

    if (error.response) {
      if (error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response.data.non_field_errors) {
        errorMessage = error.response.data.non_field_errors.join(", ");
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }

    setErrorMessage(errorMessage);
    Alert.alert("Erro", errorMessage);
  };

  const handleForgotPassword = () => {
    setForgotPasswordModal(true);
    setForgotPasswordStep("email");
    setResetEmail("");
    setResetCode("");
    setNewPassword("");
  };

  const handleResetSubmit = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (forgotPasswordStep === "email") {
        await axios.post(
          "http://127.0.0.1:8000/forgot-password/",
          { email: resetEmail },
          { headers: { "Content-Type": "application/json" } }
        );
        setForgotPasswordStep("code");
        Alert.alert("Sucesso", "Um código de verificação foi enviado para o seu e-mail.");
      } else if (forgotPasswordStep === "code") {
        await axios.post(
          "http://127.0.0.1:8000/verify-reset-code/",
          { email: resetEmail, code: resetCode },
          { headers: { "Content-Type": "application/json" } }
        );
        setForgotPasswordStep("newPassword");
        Alert.alert("Sucesso", "Código verificado. Insira sua nova senha.");
      } else if (forgotPasswordStep === "newPassword") {
        await axios.post(
          "http://127.0.0.1:8000/reset-password/",
          { email: resetEmail, code: resetCode, new_password: newPassword },
          { headers: { "Content-Type": "application/json" } }
        );
        setForgotPasswordModal(false);
        Alert.alert("Sucesso", "Senha redefinida com sucesso! Faça login com sua nova senha.");
      }
    } catch (error) {
      let errorMessage = "Erro ao processar a solicitação.";
      if (error.response && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá,</Text>
      <Text style={styles.title}>
        {isRegister ? "Crie sua conta aqui" : "Seja bem vindo"}
      </Text>

      {errorMessage ? (
        <Text style={styles.errorText}>
          ⚠️ {errorMessage}
        </Text>
      ) : null}

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Username"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          testID="input-username"
        />
      </View>

      {isRegister && (
        <>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Primeiro Nome"
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Sobrenome"
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="at-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="Telefone"
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>
        </>
      )}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
    
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {!isRegister && (
        <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueci a senha</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <LinearGradient
          colors={["#A8B6FF", "#92EBFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText} >
            {isRegister ? "Cadastrar" : "Entrar"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>

     {/* <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Ionicons name="logo-facebook" size={24} color="#4267B2" />
        </TouchableOpacity>
      </View>*/}

      <TouchableOpacity onPress={toggleForm}>
        <Text style={styles.toggleText}>
          {isRegister
            ? "Já tem uma conta? Faça Login"
            : "Ainda não tem conta? Cadastre-se"}
        </Text>
      </TouchableOpacity>

      {/* Modal para recuperação de senha*/}
      <Modal
        visible={forgotPasswordModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setForgotPasswordModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setForgotPasswordModal(false)}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>
              {forgotPasswordStep === "email"
                ? "Recuperar Senha"
                : forgotPasswordStep === "code"
                ? "Verificar Código"
                : "Nova Senha"}
            </Text>

            {forgotPasswordStep === "email" && (
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  placeholder="Digite seu e-mail cadastrado"
                  style={styles.input}
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  keyboardType="email-address"
                
                />
              </View>
            )}

            {forgotPasswordStep === "code" && (
              <View style={styles.inputContainer}>
                <Ionicons name="key-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  placeholder="Digite o código recebido"
                  style={styles.input}
                  value={resetCode}
                  onChangeText={setResetCode}
                  keyboardType="numeric"
            
                />
              </View>
            )}

            {forgotPasswordStep === "newPassword" && (
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  placeholder="Digite sua nova senha"
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  testID="input-new-password"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  
                >
                  <Ionicons
                    name={showNewPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleResetSubmit} testID="botao-reset-submit">
              <LinearGradient
                colors={["#A8B6FF", "#92EBFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>
                  {forgotPasswordStep === "email"
                    ? "Enviar Código"
                    : forgotPasswordStep === "code"
                    ? "Verificar Código"
                    : "Redefinir Senha"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    right: 15,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#333",
    paddingRight: 40,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "underline",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  errorText: {
    color: '#fff',
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },  
});