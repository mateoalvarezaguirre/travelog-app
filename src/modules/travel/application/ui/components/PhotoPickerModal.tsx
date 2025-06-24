import React, {useState} from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Platform, Image, TextInput,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {PhotoContent} from "@modules/travel/domain/Types/PhotoContent";

type PhotoPickerModalProps = {
    visible: boolean;
    onClose: () => void;
    save: (content: PhotoContent) => void;
};

export default function PhotoPickerModal({
                                             visible,
                                             onClose,
                                             save,
                                         }: PhotoPickerModalProps) {

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [note, setNote] = useState<string|undefined>(undefined);

    // Pedir permiso y abrir cámara
    const handleCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Se necesita permiso para usar la cámara');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    // Pedir permiso y abrir galería
    const handleGallery = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Se necesita permiso para acceder a la galería');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleClose = () => {
        setImageUri(null);
        setNote(undefined);
        onClose();
    }

    const handleSubmit = () => {
        if (imageUri) {
            const content: PhotoContent = {
                type: 'photo',
                uri: imageUri,
                note: note,
                date: Date.now().toString()
            };
            save(content);
        } else {
            alert('Por favor, selecciona una imagen antes de guardar.');
        }

        setImageUri(null);
        setNote(undefined);
        onClose();
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <View style={styles.modal}>
                <Text style={styles.title}>Nueva imagen</Text>
                <TouchableOpacity style={styles.btn} onPress={handleCamera}>
                    <Text style={styles.btnText}>Tomar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={handleGallery}>
                    <Text style={styles.btnText}>Seleccionar de galería</Text>
                </TouchableOpacity>
                {imageUri && (
                    <>
                        <Image source={{ uri: imageUri }} style={styles.image} />
                        <View style={styles.field}>
                            <TextInput
                                style={[styles.input]}
                                multiline
                                value={note}
                                onChangeText={setNote}
                                placeholder="¿Te gustaría darle una descripción a tu foto?"
                            />
                        </View>
                    </>
                )}

                <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={handleClose}>
                    <Text style={[styles.btnText, { color: '#FF3B30' }]}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, styles.save]} onPress={handleSubmit}>
                    <Text style={[styles.btnText, { color: '#f1f1f1' }]}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: '#00000066',
    },
    modal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        paddingHorizontal: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        textAlign: 'center',
    },
    btn: {
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
        marginBottom: 12,
        alignItems: 'center',
    },
    btnText: {
        fontSize: 16,
        color: '#111',
        fontWeight: '500',
    },
    cancel: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    save: {
        backgroundColor: '#101010',
    },
    image: {
        width: '100%',
        minHeight: 200,
        borderRadius: 12,
        marginVertical: 12,
        resizeMode: 'cover',
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
    }
});