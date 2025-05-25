import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "@modules/auth/Application/ui/screens/LoginScreen";
import RegisterScreen from "@modules/auth/Application/ui/screens/RegisterScreen";
import HomeScreen from "@modules/home/ui/screens/HomeScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
    );
}
