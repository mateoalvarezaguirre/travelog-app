import React, { useState, useContext } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {delay} from "@shared/utils/delay";
import {AuthContext} from '@context/AuthContext';
import uuidGenerator from "@shared/utils/uuidGenerator";
import PasswordInput from "@shared/ui/Form/Inputs/PasswordInput";

const LoginScreen = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useContext(AuthContext);

    const validate = () => {
        if (!/\S+@\S+\.\S+/.test(email)) return 'Email inválido';
        if (password.length < 6) return 'La contraseña debe tener ≥6 caracteres';
        return '';
    };

    const handleLogin = async () => {
        setLoading(true);
        const err = validate();
        if (err) {
            setError(err);
            setLoading(false);
            return;
        }

        await delay(1000);

        try {
            if (email === 'test@test.com' && password === '123456') {

                const fakeToken = uuidGenerator.generate();

                await signIn(fakeToken);
            } else {
                Alert.alert('Error', 'Credenciales incorrectas');
            }
        } catch (e: any) {
            Alert.alert('Error', e.response?.data?.message || 'Login fallido');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Register'}],
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Iniciar sesión</Text>
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
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={styles.buttonText}>Ingresar</Text>
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
            </TouchableOpacity>
        </View>
    );
};

export default LoginScreen;

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
    buttonDisabled: {
        backgroundColor: '#8FBCE6',
    },
    link: {
        marginTop: 16, textAlign: 'center',
        color: '#2F80ED', textDecorationLine: 'underline',
    },
    error: { color: '#D32F2F', marginBottom: 8, textAlign: 'center' },
});