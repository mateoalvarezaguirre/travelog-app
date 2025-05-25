import {useState} from "react";
import {StyleSheet, TextInput, TouchableOpacity, View} from "react-native";
import { Ionicons } from '@expo/vector-icons';

export interface PasswordInputProps {
    placeholder?: string;
    password: string;
    setPassword: (password: string) => void;
}

export const PasswordInput = ({placeholder, password, setPassword}: PasswordInputProps) => {

    const [showPassword, setShowPassword] = useState(false);

    const placeholderText = placeholder || 'Contraseña';

    return (
        <View style={styles.inputWrapper}>
            <TextInput
                style={styles.input}
                placeholder={placeholderText}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
            />
            <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
            >
                <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#666"
                />
            </TouchableOpacity>
        </View>
    );
};

export default PasswordInput;

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#F0F0F0', borderRadius: 12,
        padding: 12, marginBottom: 12,
    },
    inputWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    eyeBtn: {
        position: 'absolute',
        right: 16,
        top: 12,
    },
});