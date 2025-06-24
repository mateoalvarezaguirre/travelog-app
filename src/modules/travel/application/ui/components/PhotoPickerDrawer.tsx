import React, { useMemo, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';

type Props = {
    sheetRef: React.RefObject<BottomSheet>;
    onPick: (uri: string) => void;
};

export default function PhotoPickerDrawer({ sheetRef, onPick }: Props) {
    // define los puntos de parada (height %) del sheet
    const snapPoints = useMemo(() => ['20%', '50%'], []);

    const handleCamera = useCallback(async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return alert('Permiso de cámara denegado');
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        if (!result.canceled) {
            onPick(result.assets[0].uri);
            sheetRef.current?.close();
        }
    }, [onPick, sheetRef]);

    const handleGallery = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') return alert('Permiso de galería denegado');
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        if (!result.canceled) {
            onPick(result.assets[0].uri);
            sheetRef.current?.close();
        }
    }, [onPick, sheetRef]);

    return (
        <BottomSheet
            ref={sheetRef}
            index={-1}             // inicialmente cerrado
            snapPoints={snapPoints}
            enablePanDownToClose  // permite arrastrar hacia abajo para cerrar
        >
            <View style={styles.content}>
                <Text style={styles.title}>Agregar imagen</Text>
                <TouchableOpacity style={styles.btn} onPress={handleCamera}>
                    <Text style={styles.btnText}>Tomar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={handleGallery}>
                    <Text style={styles.btnText}>Seleccionar galería</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
}

const styles = StyleSheet.create({
    content: { flex: 1, alignItems: 'center', paddingHorizontal: 16 },
    title: { fontSize: 18, fontWeight: '600', marginVertical: 12 },
    btn: {
        width: '100%',
        paddingVertical: 14,
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 8,
    },
    btnText: { fontSize: 16, color: '#111' },
});