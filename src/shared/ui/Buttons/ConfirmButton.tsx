import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";

export interface ConfirmButtonProps {
    onConfirm: () => void;
    confirmText?: string;
    disabled?: boolean;
}

export const ConfirmButton = (props: ConfirmButtonProps) => {
    const confirmText = props.confirmText || 'Confirmar';

    return (
        <TouchableOpacity
            style={[styles.button, props.disabled && styles.buttonDisabled]}
            onPress={props.onConfirm}
            disabled={props.disabled}
        >
            {!props.disabled
                ? <Text style={styles.buttonText}>{confirmText}</Text>
                : <ActivityIndicator color="#FFF" />
            }
        </TouchableOpacity>
    );
};

export default ConfirmButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#101010',
        borderRadius: 12,
        paddingVertical: 14, alignItems: 'center', marginTop: 8,
    },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    buttonDisabled: {
        backgroundColor: '#8FBCE6',
    },
});