import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {NoteContent as NoteContentType} from "@modules/travel/domain/Types/NoteContent";

interface NoteContentProps {
    noteContent: NoteContentType
}

export const NoteContent = ({noteContent} : NoteContentProps) => {
    return (
        <View style={styles.note}>
            <View>
                <Text style={{ fontSize: 20, color: '#101010', fontWeight: 'bold', marginBottom: 4 }}>
                    {noteContent.title}
                </Text>
                <Text style={{ fontSize: 14, color: '#b1b1b1', marginBottom: 8 }}>
                    {new Date(noteContent.date).toLocaleDateString()}
                </Text>
            </View>

            <Text style={styles.text}>{noteContent.text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    note: {
        padding: 12,
        borderRadius: 12,
        width: '100%',
        backgroundColor: '#f1f1f1',
    },
    text: {
        fontSize: 16,
        color: '#101010',
        lineHeight: 22,
    },
})