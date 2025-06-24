import {Image, StyleSheet, Text, View} from "react-native";
import {ContentItem} from "@modules/travel/domain/Types/ContentItem";
import React from "react";
import { LinearGradient } from 'expo-linear-gradient';
import {PhotoContent} from "@modules/travel/domain/Types/PhotoContent";

interface ImageContentProps {
    content: PhotoContent
}

export const ImageContent = ({content}: ImageContentProps) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: content.uri }} style={styles.detailMedia} />
            {content.note && (
                <View style={styles.note}>
                    <LinearGradient
                        colors={['rgba(0,0,0,0.7)', 'transparent']}
                        style={styles.gradient}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: 0.5, y: 0 }}
                    />
                    <Text style={styles.noteText}>{content.note}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff;',
    },
    detailMedia: {
        width: '100%',
        aspectRatio: 16 / 9,
        borderRadius: 8,
    },
    note: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'flex-end',
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100%',
    },
    noteText: {
        fontSize: 16,
        color: '#f1f1f1',
        lineHeight: 22,
        paddingHorizontal: 16,
        paddingVertical: 16,
    }
})