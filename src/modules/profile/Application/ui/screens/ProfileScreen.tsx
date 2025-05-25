import React, {useContext, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {AuthContext} from "@context/AuthContext";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {Profile} from "@modules/profile/Domian/Types/ProfileType";
import {ProfileMockApi} from "@modules/profile/Infrastructure/External/ProfileMockApi";
import TravelogLoader from "@shared/ui/TravelogLoader";

export default function ProfileScreen() {

    const { signOut } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const [profile, setProfile] = React.useState<Profile|null>(null);
    const [loading, setLoading] = useState(true);
    const profileApi = new ProfileMockApi();

    useFocusEffect(
        React.useCallback(() => {
            loadProfile().then();
        },[])
    )

    const loadProfile = async () => {
        setLoading(true);
        try {
           const profileFetched = await profileApi.getProfile();

           setProfile(
               profileFetched
           )
        } catch (e: any) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (loading || !profile) {
        return <TravelogLoader message="Cargando perfil…" />;
    }

    return (
        <View style={styles.container}>
            {/* Avatar */}
            <Image
                source={{ uri: profile.avatarUrl }}
                style={styles.avatar}
                alt={profile.name}
            />

            {/* Nombre y Email */}
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>

            {/* Botones de acción */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('EditProfile')}
            >
                <Text style={styles.buttonText}>Editar Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.signOutButton]}
                onPress={signOut}
            >
                <Text style={[styles.buttonText, styles.signOutText]}>
                    Cerrar sesión
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        paddingTop: 40,
    },
    avatar: {
        width: 120,
        height: 120,
        borderColor: 'black',
        borderWidth: 3,
        borderRadius: 60,
        marginTop: 35,
        margin: 20,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    button: {
        width: '80%',
        backgroundColor: '#2F80ED',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 12,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    signOutButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#D32F2F',
    },
    signOutText: {
        color: '#D32F2F',
    },
});
