import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage
import { AppState } from 'react-native';
import Inicio from "./pages/Inicio";
import Inicio2 from "./pages/Inicio2";
import Inicio3 from "./pages/Inicio3";
import Inicio5 from "./pages/Inicio5";
import Login from "./pages/login/login";
import Inicio4 from "./pages/Inicio4Token";
import dash from "./pages/dashboard/dash";
import SearchScreen from "./pages/search/SearchScreen"
import Grafic from "./pages/chat/Grafic";
import VisionGeral from "./pages/VIsion/VisionGeral";
import Notiview from "./pages/Notiview/Notiview";
import UserScreen from "./pages/user/UserScreen";
import DeviceHistory from "./pages/DeviceHistory/DeviceHistory";




const Stack = createStackNavigator();

export default function App() {
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
