import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function Inicio3({ navigation }) {
  return (
    <ImageBackground
      source={require("../assets/Background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} testID="back-button">
          <Text style={styles.backButtonText} testID="back-button-text">❮</Text>
        </TouchableOpacity>
        
        <Image
          source={require("../assets/city.png")}
          style={styles.image}
          testID="city-image"
        />
        
        <Text style={styles.title} testID="titl-text">Identifique vazamentos no seu apartamento</Text>
        
        <Text style={styles.subtitle} testID="subtitle-text">
          Com o auxílio de sensores, você será prontamente notificado caso haja algum rompimento nas tubulações
        </Text>
        
        <TouchableOpacity onPress={() => navigation.navigate("Inicio4")} testID="continu-button">
          <LinearGradient
            colors={["#A8B6FF", "#92EBFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Continuar</Text>
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
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "##000000",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "##000000",
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