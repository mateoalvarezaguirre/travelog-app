import {ContentItem} from "@modules/travel/domain/Types/ContentItem";
import { useVideoPlayer, VideoView } from 'expo-video';
import {StyleSheet, Dimensions, TouchableWithoutFeedback, Animated, View, Text,} from "react-native";
import { Asset } from 'expo-asset';
import React, {useEffect, useState} from "react";
import {LinearGradient} from "expo-linear-gradient";

interface VideoContentProps {
    video: ContentItem
}

export const VideoContent = ({video}: VideoContentProps) => {

    if (video.type !== 'video')
        throw new Error('The content item is not a video');

    if (!video.uri)
        throw new Error('The video content item does not have a URI');

    const [uri, setUri] = useState<string|null>(null);

    useEffect(() => {
        (async () => {

            const isRemote = video.uri.startsWith('http://') || video.uri.startsWith('https://');

            if (isRemote) {
                setUri(video.uri);
                return; // no need to download remote videos
            }

            const videoModule = require('@assets/travels/videos/travelShort.mp4'); // asume que el URI es un módulo local

            const asset = Asset.fromModule(videoModule);
            await asset.downloadAsync();        // descarga / cachea el vídeo
            setUri(asset.localUri || asset.uri);
        })();
    }, []);

    const player = useVideoPlayer(uri!, (player) => {
        player.play();
        player.loop = true;
    });

    const togglePlay = () => {
        player.playing ? player.pause() : player.play();
    };

    if (!uri) {
        return (<Text>'ups'</Text>);
        // return null; // o un loader pequeño
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={togglePlay} style={styles.videoControl}>
                <View>
                    <VideoView style={styles.video} player={player} nativeControls={false}/>
                    {video.note && (
                        <View style={styles.note}>
                            <LinearGradient
                                colors={['rgba(0,0,0,0.7)', 'transparent']}
                                style={styles.gradient}
                                start={{ x: 0.5, y: 1 }}
                                end={{ x: 0.5, y: 0 }}
                            />
                            <Text style={styles.noteText}>{video.note}</Text>
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        aspectRatio: 9 / 16,
        borderRadius: 8,
        boxShadow: '15px 12px 4px red',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    videoControl: {
        position: 'relative'
    },
    note: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'flex-end',
        zIndex: 1
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
});