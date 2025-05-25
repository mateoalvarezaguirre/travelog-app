import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Image,
    StyleSheet,
    ScrollView,
    Alert, TouchableOpacity,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateRangeSelector from '@modules/travel/application/ui/components/DateRangeSelector';
import { useTravelStorage } from "@shared/hooks/useTravelStorage";
import {useNavigation} from "@react-navigation/native";

export default function AddTripScreen() {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const navigation = useNavigation<any>();

    const { addTrip } = useTravelStorage();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!title || !location || !description || !imageUri || !startDate || !endDate) {
            Alert.alert('Faltan datos', 'Por favor completá todos los campos.');
            return;
        }

        if ((endDate ?? 0) < (startDate ?? 0)) {
            Alert.alert('Error', 'La fecha de fin debe ser posterior a la de inicio.');
            return;
        }

        const photos = [imageUri];

        // Aquí podrías llamar a un caso de uso o API real
        const newTrip = {
            title,
            location,
            description,
            photos,
            dateStart: startDate,
            dateEnd: endDate,
            tags: []
        };

        await addTrip(newTrip);

        Alert.alert(
            'Excelente',
            '¡Creaste un nuevo viaje!',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'HomeScreen'}],
                        });
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Nuevo viaje</Text>

            <View style={styles.field}>
                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ej: Aventura en Kioto"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Ubicación</Text>
                <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Ej: Tokio, Japón"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Fechas</Text>
                <DateRangeSelector
                    onRangeSelected={(start, end) => {
                        setStartDate(start);
                        setEndDate(end);
                    }}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    multiline
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Contá tu experiencia"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Imagen</Text>
                <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
                    <Text style={styles.uploadText}>
                        {imageUri ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    </Text>
                </TouchableOpacity>
                {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <Text style={styles.saveText}>Guardar viaje</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 65,
        backgroundColor: '#F1F1F1',
        paddingHorizontal: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111',
        marginBottom: 16,
    },
    field: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        padding: 12,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    uploadBtn: {
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },
    uploadText: {
        fontSize: 16,
        color: '#111',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginTop: 12,
    },
    saveBtn: {
        backgroundColor: '#2F80ED',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 40,
    },
    saveText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});