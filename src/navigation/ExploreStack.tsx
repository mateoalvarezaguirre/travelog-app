import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TravelDetailScreen from '@modules/travel/application/ui/screens/TravelDetailScreen';
import AddTripScreen from "@modules/travel/application/ui/screens/AddTripScreen";
import ExploreScreen from "@modules/explore/ui/screens/ExploreScreen";

const Stack = createNativeStackNavigator();

export default function ExploreStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ExploreScreen" component={ExploreScreen} options={{ title: 'Explorar destinos' }}/>
            <Stack.Screen name="TravelDetail" component={TravelDetailScreen} options={{ title: 'Detalle' }} />
        </Stack.Navigator>
    );
}