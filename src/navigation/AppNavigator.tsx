import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '@modules/profile/Application/ui/screens/ProfileScreen';
import HomeStack from "./HomeStack";
import ExploreStack from "./ExploreStack";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                // color y tamaño lo gestiona React Navigation
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: React.ComponentProps<typeof MaterialIcons>['name'];

                    switch (route.name) {
                        case 'Home':
                            iconName = 'home';
                            break;
                        case 'Explore':
                            iconName = 'travel-explore';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person'      : 'person-outline';
                            break;
                        default:
                            iconName = 'circle';
                    }

                    return <MaterialIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#101010',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: { paddingVertical: 12, height: 70},
            })}
        >
            <Tab.Screen name="Home" component={HomeStack} />
            <Tab.Screen name="Explore" component={ExploreStack} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}