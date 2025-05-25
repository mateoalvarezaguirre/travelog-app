import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import PasswordInput from "@shared/ui/Form/Inputs/PasswordInput";

export default function RegisterScreen() {
    const nav = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');

    const validate = () => {
        if (!/\S+@\S+\.\S+/.test(email)) return 'Email inválido';
        if (password.length < 6) return 'La contraseña debe tener ≥6 caracteres';
        if (password !== confirm) return 'Las contraseñas no coinciden';
        return '';
    };

    const handleRegister = () => {
        const err = validate();
        if (err) {
            setError(err);
            return;
        }
        // Mock API
        setTimeout(() => {
            Alert.alert('Registrado', 'Cuenta creada con éxito');
            nav.navigate('Login');
        }, 1000);
    };

    const handleLogin = () => {
        nav.reset({
            index: 0,
            routes: [{ name: 'Login'}],
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Crear cuenta</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />
            <PasswordInput password={password} setPassword={setPassword} />
            <PasswordInput password={confirm} setPassword={setConfirm} placeholder={'Confirmar contraseña'} />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.link}>¿Ya tenés cuenta? Iniciá sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#FAFAFA',
        justifyContent: 'center', padding: 24,
    },
    header: { fontSize: 28, fontWeight: '700', color: '#111', marginBottom: 24 },
    input: {
        backgroundColor: '#F0F0F0', borderRadius: 12,
        padding: 12, marginBottom: 12,
    },
    button: {
        backgroundColor: '#2F80ED', borderRadius: 12,
        paddingVertical: 14, alignItems: 'center', marginTop: 8,
    },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    link: {
        marginTop: 16, textAlign: 'center',
        color: '#2F80ED', textDecorationLine: 'underline',
    },
    error: { color: '#D32F2F', marginBottom: 8, textAlign: 'center' },
});