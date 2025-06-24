import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Image,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateRangeSelector from '@modules/travel/application/ui/components/DateRangeSelector';
import { useTravelStorage } from "@shared/hooks/useTravelStorage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TravelEntry } from '@modules/travel/domain/Types/TravelEntry';
import ConfirmButton from "@shared/ui/Buttons/ConfirmButton";
import BaseError from "@shared/Errors/BaseError";
import {UpdateTripService} from "@modules/travel/domain/Services/UpdateTripService";

export default function EditTripScreen() {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string | null>(null);
    const [endDate, setEndDate] = useState<string | null>(null);

    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { loading,updateTrip } = useTravelStorage();
    const { trip } = route.params;

    useEffect(() => {
        const loadTrip = async (trip: TravelEntry) => {
            setTitle(trip.title);
                    setLocation(trip.location);
                    setDescription(trip.description);
                    setCoverImage(trip.coverPicture);
                    setStartDate(trip.dateStart);
                    setEndDate(trip.dateEnd);
        };
        loadTrip(trip).then();
    }, [trip]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!result.canceled) {
            setCoverImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {

        try {

            const updateService = new UpdateTripService();

            const updatedTrip: TravelEntry = {
                id: trip.id,
                title,
                location,
                description,
                coverPicture: coverImage ?? trip.coverPicture,
                content: [
                    {
                        type: 'note',
                        text: 'description',
                        date: '2024-10-01',
                    },
                ],
                dateStart: startDate ?? trip.dateStart,
                dateEnd: endDate ?? trip.dateEnd,
                tags: []
            };

            await updateService.updateTrip(trip, updatedTrip);

            await updateTrip(updatedTrip);

            Alert.alert(
                'Excelente',
                '¡Viaje actualizado con éxito!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'HomeScreen', params: { travel: updatedTrip } }],
                            });
                        }
                    }
                ]
            );

        } catch (e: any) {

            if (e instanceof BaseError) {
                Alert.alert(
                    e.getTitle(),
                    e.getErrorMessage()
                );
            } else {
                Alert.alert(
                    '¡Ups!',
                    e.message || 'Ocurrió un error inesperado. Por favor, intentá nuevamente.'
                )
            }
            return;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Editar viaje</Text>

            <View style={styles.field}>
                <Text style={styles.label}>Títulooo</Text>
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
                    initialStartDate={startDate}
                    initialEndDate={endDate}
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
                        {coverImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    </Text>
                </TouchableOpacity>
                {coverImage && <Image source={{ uri: coverImage }} style={styles.image} />}
            </View>
            <ConfirmButton onConfirm={handleSubmit} confirmText={'Guardar cambios'} disabled={loading} />
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
        backgroundColor: '#101010',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 40,
    },
    buttonDisabled: {
        backgroundColor: '#8FBCE6',
    },
    saveText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
}); 