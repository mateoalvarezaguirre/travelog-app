import React from 'react';
import {
    FlatList,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    View,
    Image, Text,
} from 'react-native';
import {ContentItem} from "@modules/travel/domain/Types/ContentItem";
import {VideoContent} from "@modules/travel/application/ui/components/VideoContent";
import {NoteContent} from "@modules/travel/application/ui/components/NoteContent";
import {backgroundColor} from "react-native-calendars/src/style";

type ContentGridProps = {
    content: ContentItem[]
};

const viewWidth = Dimensions.get('window').width - 32; // 16px padding on each side

export default function ContentGrid({ content }: ContentGridProps) {

    const getContentItem = (item: ContentItem) => {
        switch (item.type) {
            case 'photo':
                return (
                    <TouchableOpacity>
                        <Image source={{ uri: item.uri }} style={styles.media} />
                    </TouchableOpacity>
                );
            case 'video':
                return <VideoContent video={item} />;
            case 'note':
                return <NoteContent text={item.text} />;
            default:
                return null;
        }
    }

    return (
        <View style={styles.gridContainer}>
            <View style={styles.gridVerticalItem}>
                {getContentItem(content[2])}
            </View>
            <View style={styles.gridHorizontalItem}>
                <View style={styles.gridRectangleItem}><Text>Un rectángulo</Text></View>
                <View style={styles.gridSquareContainer}>
                    <View style={styles.gridSquareItem} ><Text>Un cuadrado</Text></View>
                    <View style={styles.gridSquareItem} ><Text>Un cuadrado</Text></View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    gridContainer: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "space-between",
        backgroundColor: 'brown',
    },
    gridVerticalItem: {
        width: viewWidth / 3,
        backgroundColor: 'red',
        padding: 8
    },
    gridHorizontalItem: {
        display: "flex",
        flexDirection: 'column',
    },
    gridRectangleItem: {
        backgroundColor: 'green',
        aspectRatio: 16 / 9,
        width: (viewWidth / 3) * 2,
    },
    gridSquareContainer: {
        width: (viewWidth / 3) * 2,
        display: "flex",
        flexDirection: 'row',
    },
    gridSquareItem: {
        aspectRatio: 1,
        width: viewWidth / 3,
        backgroundColor: 'blue',
    },
    media: {
        width: '100%',
        height: '100%',
        borderRadius: 8,
    }
});
