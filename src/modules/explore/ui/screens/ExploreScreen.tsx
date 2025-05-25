import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
} from 'react-native';
import { useTravelStorage } from '@shared/hooks/useTravelStorage';
import {useNavigation} from "@react-navigation/native";

const categories = ['All', 'Cultura', 'Aventura', 'Naturaleza', 'Gastronomía', 'Relajación', 'Playa'];

export default function ExploreScreen() {
    const { trips } = useTravelStorage();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const navigation = useNavigation<any>();

    const filteredTrips = useMemo(() => {
        const q = search.trim().toLowerCase();

        return trips.filter((trip) => {
            const matchSearch =
                trip.title.toLowerCase().includes(q) || trip.location.toLowerCase().includes(q);
            const matchCategory =
                selectedCategory === 'All' ||
                trip.tags?.includes(selectedCategory.toLowerCase());
            return matchSearch && matchCategory;
        });
    }, [search, selectedCategory, trips]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Explorar destinos</Text>

            <TextInput
                style={styles.searchInput}
                placeholder="Buscar destinos o actividades..."
                value={search}
                onChangeText={setSearch}
            />

            <View style={styles.categoryContainer}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.categoryButton,
                            selectedCategory === cat && styles.categoryButtonSelected,
                        ]}
                        onPress={() => setSelectedCategory(cat)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === cat && styles.categoryTextSelected,
                            ]}
                        >
                            {cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredTrips}
                keyExtractor={(item, index) => item.id ?? index.toString()}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('TravelDetail', { travel: item })}
                    >
                        <Image source={{ uri: item.photos[0] }} style={styles.image} />
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.subtitle}>{item.location}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <Text style={styles.noResults}>No hay destinos disponibles</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 65,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 16,
        color: '#111',
    },
    searchInput: {
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
    },
    categoryButtonSelected: {
        backgroundColor: '#111',
    },
    categoryText: {
        color: '#333',
        fontWeight: '600',
    },
    categoryTextSelected: {
        color: '#fff',
    },
    list: {
        paddingBottom: 50,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 2,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    image: {
        height: 180,
        width: '100%',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        marginHorizontal: 12,
    },
    subtitle: {
        marginHorizontal: 12,
        marginBottom: 12,
        color: '#666',
    },
    noResults: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#888',
    },
});