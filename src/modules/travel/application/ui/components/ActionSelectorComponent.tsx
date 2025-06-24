import {StyleSheet, TouchableOpacity, View} from "react-native";
import React, {useState} from "react";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

interface ActionSelectorComponentProps {
    setShowPhotoPicker: () => void;
    setShowNoteCreator: () => void;
}

export const ActionSelectorComponent = ({
                                            setShowPhotoPicker,
                                            setShowNoteCreator
}: ActionSelectorComponentProps) => {

    const [opened, setOpened] = useState<boolean>(false);

    const handleOpen = () => {
        setOpened(!opened);
    }

    const handleAddImage = async () => {
        setShowPhotoPicker();
        setOpened(false);
    }

    const handleAddNote = async () => {
        setShowNoteCreator();
        setOpened(false);
    }

    return (
        <TouchableOpacity
            onPress={handleOpen}
            style={styles.container}
        >
            {opened && (
                <View style={{width: '100%'}}>
                    <TouchableOpacity onPress={handleAddImage}>
                        <MaterialIcons name='image' size={24} color="#101010" style={styles.addImageIcon}/>
                    </TouchableOpacity>
                    <MaterialIcons name='video-camera-back' size={24} color="#101010" style={styles.addVideoIcon} />
                    <TouchableOpacity onPress={handleAddNote}>
                        <MaterialIcons name='note-add' size={24} color="#101010" style={styles.addNoteIcon} />
                    </TouchableOpacity>
                </View>
                
            )}
            <MaterialIcons name={!opened ? 'add' : 'remove'} size={24} color="#f1f1f1" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 10,
        right: 20,
        backgroundColor: '#101010',
        borderRadius: 50,
        padding: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    addImageIcon: {
        position: 'absolute',
        bottom: -25,
        right: 120,
    },
    addVideoIcon: {
        position: 'absolute',
        bottom: -25,
        right: 80,
    },
    addNoteIcon: {
        position: 'absolute',
        bottom: -25,
        right: 40,
    }
})