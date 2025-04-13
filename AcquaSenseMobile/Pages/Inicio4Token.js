import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Inicio4({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} testID="back-button-inicio4">
          <Text style={styles.backButtonText} testID="back-button-text-inicio4">❮</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Image
            source={require("../assets/clip-cyber-protection.png")}
            style={styles.image}
          />
          <Text style={styles.title} testID="tit-text" >Digite a chave de acesso</Text>
          
          <TextInput
            style={styles.input}
            placeholder="XXX-XXX-XXX"
            placeholderTextColor="#999"
          />
          
          <Text style={styles.description}>
            Apenas aqueles que já contrataram nossos serviços terão acesso à chave
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate("Inicio5")} testID="continue-button-inicio4">
            <LinearGradient
              colors={["#A8B6FF", "#92EBFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Cadastrar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  content: {
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10, 
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 5, 
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    marginBottom: 15, 
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});