import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage
import Inicio from "./pages/Inicio";
import Inicio2 from "./pages/Inicio2";
import Inicio3 from "./pages/Inicio3";
import Inicio5 from "./pages/Inicio5";
import Login from "./pages/login/login";
import Inicio4 from "./pages/Inicio4Token";
import dash from "./pages/dashboard/dash";
import Grafic from "./pages/chat/Grafic";
import VisionGrafic from "./pages/Vision/VisionGeral"
import Notiview from "./pages/Notiview/Notiview";
import UserScreen from "./pages/User/UserScreen"



const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkFirstAccess = async () => {
      try {
        const hasAccessed = await AsyncStorage.getItem("hasAccessed");
        if (hasAccessed) {
          setInitialRoute("Inicio4"); // Se já acessou, vai para Inicio4
        } else {
          setInitialRoute("Inicio"); // Primeira vez, vai para Inicio
          await AsyncStorage.setItem("hasAccessed", "true"); // Salva que já acessou
        }
      } catch (error) {
        console.error("Erro ao acessar AsyncStorage:", error);
        setInitialRoute("Inicio"); // Fallback em caso de erro
      }
    };

    checkFirstAccess();
  }, []);

  if (!initialRoute) {
    return null; // Aguarda a definição da rota inicial antes de renderizar
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={Inicio} />
        <Stack.Screen name="Inicio2" component={Inicio2} />
        <Stack.Screen name="Inicio3" component={Inicio3} />
        <Stack.Screen name="Inicio4" component={Inicio4} />
        <Stack.Screen name="Inicio5" component={Inicio5} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="dash" component={dash} />
        <Stack.Screen name="Grafic" component={Grafic} />
        <Stack.Screen name="UserScreen" component={UserScreen} />
        <Stack.Screen name="VisionGrafic" component={VisionGrafic} />
        <Stack.Screen name="Notiview" component={Notiview} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
