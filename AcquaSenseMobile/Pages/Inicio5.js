import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Inicio5({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>❮</Text>
        </TouchableOpacity>

        <Text style={styles.welcomeText}>Bem vindos ao Acqua Sense</Text>

        <Image
          source={require("../assets/LogoAcquaSense.png")}
          style={styles.image}
        />

        <Text style={styles.title}>Uma solução de monitoramento em tempo real</Text>
        <Text style={styles.subtitle}>
          Crie sua conta e acesse agora mesmo os nossos serviços
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate("Inicio3")}>
          <LinearGradient
            colors={["#A8B6FF", "#92EBFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Criar conta</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  welcomeText: {
    fontSize: 20,
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#000000",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});