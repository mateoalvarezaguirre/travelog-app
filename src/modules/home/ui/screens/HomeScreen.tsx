import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTravelStorage } from '@shared/hooks/useTravelStorage';
import TravelogLoader from '@shared/ui/TravelogLoader';
import { formatDate } from '@shared/utils/formatDate';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable"
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';


export default function HomeScreen() {
    const navigation = useNavigation<any>();
    const { trips, loading, loadTrips, removeTrip } = useTravelStorage();
    const [query, setQuery] = useState('');

    useEffect(() => {
        loadTrips().then();
    }, []);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return trips.filter(
            (t) =>
                t.title.toLowerCase().includes(q) ||
                t.location.toLowerCase().includes(q)
        );
    }, [trips, query]);

    const handleRightAction = (prog: SharedValue<number>, drag: SharedValue<number>, tripId: string) => {
        const styleAnimation = useAnimatedStyle(() => {
            return {
                transform: [{ translateX: drag.value + 90 }],
            };
        });

        return (
            <Reanimated.View style={styleAnimation}>
                <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(tripId)}
                >
                    <Text style={styles.deleteTxt}>Eliminar</Text>
                </TouchableOpacity>
            </Reanimated.View>
        );
    }

    const handleDelete = async (id: string) => {
        await removeTrip(id);
    }

    if (loading) {
        return <TravelogLoader message="Cargando tus viajes…" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mis viajes</Text>

            <TextInput
                style={styles.searchInput}
                placeholder="Buscar por título o lugar…"
                value={query}
                onChangeText={setQuery}
            />

            <FlatList
                data={filtered}
                refreshing={loading}
                onRefresh={loadTrips}
                keyExtractor={(item, index) => item.id ?? index.toString()}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.empty}>No hay viajes que coincidan</Text>
                }
                renderItem={({ item }) => (
                    <GestureHandlerRootView>
                        <ReanimatedSwipeable
                            renderRightActions={(prog, drag) => handleRightAction(prog, drag, item.id ?? '')}
                        >
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() =>
                                    navigation.navigate('TravelDetail', { travel: item })
                                }
                            >
                                <Image source={{ uri: item.coverPicture }} style={styles.image} />
                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{item.title}</Text>
                                    <Text style={styles.cardSubtitle}>
                                        {item.location} · {formatDate(item.dateStart)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </ReanimatedSwipeable>
                    </GestureHandlerRootView>
                )}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddTrip')}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 16,
        paddingTop: 65,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111',
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    list: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1
    },
    image: {
        width: '100%',
        height: 160,
    },
    cardContent: {
        padding: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    empty: {
        textAlign: 'center',
        marginTop: 60,
        fontSize: 16,
        color: '#888',
    },
    fab: {
        position: 'absolute',
        right: 24,
        bottom: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#101010',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    fabText: {
        fontSize: 32,
        color: '#FFF',
        lineHeight: 32,
    },
    deleteBtn: {
        backgroundColor: '#FF6B6B',
        width: 100,
        height: 226,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomRightRadius: 16,
        borderTopRightRadius: 16,
        zIndex: 2,
    },
    deleteTxt: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
});