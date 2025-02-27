import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Inicio from "./pages/Inicio";
import Inicio2 from "./pages/Inicio2";
import Inicio3 from "./pages/Inicio3";
import Inicio5 from "./pages/Inicio5";
import Login from "./pages/login/login";
import Inicio4 from "./pages/Inicio4Token" 
import dash from "./pages/dashboard/dash" 

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
