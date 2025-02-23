
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function Inicio2({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/energetika.png")} // Caminho da imagem
        style={styles.image}
      />
      <Text style={styles.title}>Monitore seu consumo de água diário</Text>
      <Text style={styles.subtitle}>
        Acompanhe diariamente a quantidade de litros que você consome
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Inicio3")} // Substitua 'OutraTela' pelo nome da próxima tela
      >
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F8FF",
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#4CA1FF",
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
