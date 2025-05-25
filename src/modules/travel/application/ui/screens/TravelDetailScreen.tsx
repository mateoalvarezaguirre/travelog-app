import React, { useLayoutEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { formatDate } from '@shared/utils/formatDate';

export default function TravelDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { travel } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            title: travel.title,
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#FAFAFA', elevation: 0 },
            headerTitleStyle: { fontSize: 20, fontWeight: '600', color: '#111' },
            headerTintColor: '#2F80ED',
        });
    }, [navigation, travel.title]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image source={{ uri: travel.photos[0] }} style={styles.image} />

            <View style={styles.content}>
                {/* Fechas */}
                <Text style={styles.dates}>
                    {formatDate(travel.dateStart)} → {formatDate(travel.dateEnd)}
                </Text>

                {/* Título & Ubicación */}
                <Text style={styles.title}>{travel.title}</Text>
                <Text style={styles.location}>{travel.location}</Text>

                {/* Tags */}
                <View style={styles.tagContainer}>
                    {(travel.tags || []).map((tag: string) => (
                        <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
                        </View>
                    ))}
                </View>

                {/* Descripción */}
                <Text style={styles.sectionHeader}>Descripción</Text>
                <Text style={styles.description}>{travel.description}</Text>

                {/* Botón de acción */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {/* tu lógica aquí */}}
                >
                    <Text style={styles.actionText}>Editar Viaje</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FAFAFA',
        paddingBottom: 24,
    },
    image: {
        width: '100%',
        height: 240,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    dates: {
        color: '#888',
        fontSize: 14,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    location: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    tag: {
        backgroundColor: '#E0E0E0',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 22,
        color: '#444',
        marginBottom: 24,
    },
    actionButton: {
        backgroundColor: '#2F80ED',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    actionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
