import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Platform } from "react-native";
import * as Notifications from "expo-notifications"; // Importar expo-notifications
import Inicio from "./pages/Inicio";
import Inicio2 from "./pages/Inicio2";
import Inicio3 from "./pages/Inicio3";
import Inicio5 from "./pages/Inicio5";
import Login from "./pages/login/login";
import Inicio4 from "./pages/Inicio4Token";
import dash from "./pages/dashboard/dash";
import SearchScreen from "./pages/search/SearchScreen";
import Grafic from "./pages/chat/Grafic";
import VisionGeral from "./pages/VIsion/VisionGeral";
import Notiview from "./pages/Notiview/Notiview";
import UserScreen from "./pages/user/UserScreen";
import DeviceHistory from "./pages/DeviceHistory/DeviceHistory";


// Configurar o comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Exibir alerta
    shouldPlaySound: true, // Tocar som
    shouldSetBadge: false, // Não mostrar badge
  }),
});

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Função para configurar permissões e notificações
    const setupNotifications = async () => {
      try {
        // Solicitar permissão para notificações
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          console.log("Permissão para notificações não concedida!");
          return;
        }

        // Configurar canal de notificações para Android
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        // Obter o token de notificação push
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Push Token:", token);

        // Enviar o token para o backend (ajuste a URL do seu backend)
        await fetch("https://seu-backend.com/api/save-token", { // Saul alterar
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        // Salvar o token no AsyncStorage (opcional, para uso local)
        await AsyncStorage.setItem("pushToken", token);
      } catch (error) {
        console.error("Erro ao configurar notificações:", error);
      }
    };

    // Configurar listeners para notificações
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notificação recebida:", notification);
      // Aqui você pode navegar para uma tela específica, como Notiview
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("Interação com notificação:", response);
      // Exemplo: navegar para Notiview ao clicar na notificação
      // navigation.navigate("Notiview", { data: response.notification.request.content.data });
    });

    setupNotifications();

    // Limpar listeners ao desmontar o componente
    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Inicio2" component={Inicio2} />
        <Stack.Screen name="Inicio3" component={Inicio3} />
        <Stack.Screen name="Inicio4" component={Inicio4} />
        <Stack.Screen name="Inicio5" component={Inicio5} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="dash" component={dash} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="Grafic" component={Grafic} />
        <Stack.Screen name="UserScreen" component={UserScreen} />
        <Stack.Screen name="VisionGrafic" component={VisionGeral} />
        <Stack.Screen name="Notiview" component={Notiview} />
        <Stack.Screen name="DeviceHistory" component={DeviceHistory} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

