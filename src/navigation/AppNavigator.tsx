import React, {useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import ProfileScreen from '@modules/profile/Application/ui/screens/ProfileScreen';
import HomeStack from "./HomeStack";
import ExploreStack from "./ExploreStack";
import AuthStack from "./AuthStack";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Explore" component={ExploreStack} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}