import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@modules/home/ui/screens/HomeScreen';
import TravelDetailScreen from '@modules/travel/application/ui/screens/TravelDetailScreen';
import AddTripScreen from "@modules/travel/application/ui/screens/AddTripScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />
            <Stack.Screen name="TravelDetail" component={TravelDetailScreen} options={{ title: 'Detalle' }} />
            <Stack.Screen name="AddTrip" component={AddTripScreen} options={{ title: 'Nuevo Viaje' }} />
        </Stack.Navigator>
    );
}