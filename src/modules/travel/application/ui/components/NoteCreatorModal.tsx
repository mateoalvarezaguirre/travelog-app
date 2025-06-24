import {NoteContent} from "@modules/travel/domain/Types/NoteContent";
import {useState} from "react";
import {
    Keyboard,
    Modal,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    Platform,
    Text
} from "react-native";

type NoteCreatorModalProps = {
    visible: boolean;
    onClose: () => void;
    save: (content: NoteContent) => void;
}

export const NoteCreatorModal = ({
    visible,
    onClose,
    save,
                                 } : NoteCreatorModalProps) => {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleClose = () => {
        setTitle('');
        setContent('');
        onClose();
    }

    const handleSubmit = () => {
        if (content.trim() === '') {
            alert('El contenido no puede estar vacío');
            return;
        }
        const noteContent: NoteContent = {
            type: 'note',
            title: title.trim() || undefined,
            text: content.trim(),
            date: new Date().toISOString(),
        };
        save(noteContent);
        handleClose();
    }

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={handleClose}>
                <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <View style={styles.modal}>
                <Text style={styles.header}>Agregar nota</Text>

                <Text style={styles.label}>Título</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Escribe un título"
                    value={title}
                    onChangeText={setTitle}
                    returnKeyType="next"
                />

                <Text style={[styles.label, { marginTop: 12 }]}>Contenido</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Escribe aquí tu nota..."
                    value={content}
                    onChangeText={setContent}
                    multiline
                />

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={handleClose}>
                        <Text style={[styles.btnText, { color: '#FF3B30' }]}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                        <Text style={styles.btnText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </Modal>
    );
};

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
    header: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 16,
        textAlign: 'center',
        color: '#111',
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    input: {
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        fontWeight: '700',
        backgroundColor: '#F9F9F9',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        fontWeight: 'normal'
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: '#101010',
        borderRadius: 8,
        marginLeft: 12,
    },
    cancel: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#FF3B30',
    },
    btnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF',
    },
});