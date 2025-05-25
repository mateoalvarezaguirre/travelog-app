import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function TravelogLoader({ message = 'Cargando tus viajes...' }: { message?: string }) {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('@assets/animations/plane-loader.json')}
                autoPlay
                loop
                speed={2}
                style={styles.animation}
            />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    animation: {
        width: 200,
        height: 200,
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        color: '#555',
    },
});