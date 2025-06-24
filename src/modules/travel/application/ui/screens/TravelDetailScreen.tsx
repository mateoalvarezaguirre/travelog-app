import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity, Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { formatDate } from '@shared/utils/formatDate';
import {ContentItem} from "@modules/travel/domain/Types/ContentItem";
import {VideoContent} from "@modules/travel/application/ui/components/VideoContent";
import {TravelEntry} from "@modules/travel/domain/Types/TravelEntry";
import {NoteContent} from "@modules/travel/application/ui/components/NoteContent";
import {ImageContent} from "@modules/travel/application/ui/components/ImageContent";
import {ActionSelectorComponent} from "@modules/travel/application/ui/components/ActionSelectorComponent";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import PhotoPickerModal from "@modules/travel/application/ui/components/PhotoPickerModal";
import {useTravelStorage} from "@shared/hooks/useTravelStorage";
import {NoteCreatorModal} from "@modules/travel/application/ui/components/NoteCreatorModal";

const viewHeight = Dimensions.get("window").height;


export default function TravelDetailScreen() {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { travel }: {travel: TravelEntry} = route.params;

    const { loading, addContentToTrip } = useTravelStorage();

    const items = travel.content || [];

    const [following, setFollowing] = useState<boolean>(false);
    const [showPhotoPicker, setShowPhotoPicker] = useState<boolean>(false);
    const [showNoteCreator, setShowNoteCreator] = useState<boolean>(false);

    const handleFollowToggle = () => {
        setFollowing(!following);
        console.log(following ? 'Unfollowed' : 'Followed');
    }

    const handleShowPhotoPicker = () => {
        setShowPhotoPicker(true);
    }

    const handleShowNoteCreator = () => {
        setShowNoteCreator(true);
    }

    const handleHideNoteCreator = () => {
        setShowNoteCreator(false);
    }

    const handleHidePhotoPicker = () => {
        setShowPhotoPicker(false);
    }

    const handleSavePhoto = async (content: ContentItem) => {
        await addContentToTrip(travel.id, content);

        setShowPhotoPicker(false);
        navigation.navigate('TravelDetail', { travel: {...travel, content: [...items, content]} });
    }

    const handleSaveNote = async (content: ContentItem) => {
        await addContentToTrip(travel.id, content);

        setShowNoteCreator(false);
        navigation.navigate('TravelDetail', { travel: {...travel, content: [...items, content]} });
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: travel.coverPicture }} style={[styles.image, {position: 'absolute', top: 0}]} />
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.leftCorner}/>
                <View style={styles.rightCorner}/>
                <View style={styles.content}>

                    <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        {/* Fechas */}
                        <Text style={styles.dates}>
                            {formatDate(travel.dateStart)} → {formatDate(travel.dateEnd)}
                        </Text>
                        {/* Icono de follow/unfollow */}
                        <TouchableOpacity onPress={handleFollowToggle}>
                            <MaterialIcons name={`favorite${!following ? '-border' : ''}`} size={24} color="#101010" />
                        </TouchableOpacity>
                    </View>

                    {/* Título & Ubicación */}
                    <Text style={styles.title}>{travel.title}</Text>
                    <Text style={styles.location}>{travel.location}</Text>
                    <View style={{
                        borderRadius: 12,
                        backgroundColor: '#b5a189',
                        marginBottom: 20,
                    }}>
                        <Image
                            source={require('@assets/travels/map.png')}
                            style={{
                                height: 200,
                                width: '100%',
                            }}
                        />
                    </View>

                    {/* Tags */}
                    <View style={styles.tagContainer}>
                        {(travel.tags || []).map((tag: string) => (
                            <View key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Descripción */}
                    <Text style={styles.sectionHeader}>Descripción</Text>
                    <Text style={styles.description}>{travel.description}</Text>

                    {items.map((item: ContentItem, i: number) => (
                        <View key={i} style={styles.contentItem}>
                            {item.type === 'photo' && (
                                <ImageContent content={item} />
                            )}
                            {item.type === 'video' && (
                                <VideoContent video={item}/>
                            )}
                            {item.type === 'note' && (
                                <NoteContent noteContent={item} />
                            )}
                        </View>
                    ))}

                    {/* Botón de acción */}
                    {/*<TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('EditTrip', { trip: travel })}
                    >
                        <Text style={styles.actionText}>Editar Viaje</Text>
                    </TouchableOpacity>*/}
                </View>
                <ActionSelectorComponent
                    setShowPhotoPicker={handleShowPhotoPicker}
                    setShowNoteCreator={handleShowNoteCreator}
                />
                <PhotoPickerModal visible={showPhotoPicker} onClose={handleHidePhotoPicker} save={handleSavePhoto} />
                <NoteCreatorModal visible={showNoteCreator} onClose={handleHideNoteCreator} save={handleSaveNote} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: '#FAFAFA',
    },
    scrollView: {
        paddingBottom: 50,
        backgroundColor: '#FAFAFA',
        marginTop:240,
        minHeight: viewHeight * 0.64,
        position: 'relative'
    },
    leftCorner: {
        position: 'absolute',
        top: -40,
        left: 0,
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
        borderBottomLeftRadius: 24,
        boxShadow: '0 20px 0 0 #FAFAFA'
    },
    rightCorner: {
        position: 'absolute',
        top: -40,
        right: 0,
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
        borderBottomRightRadius: 24,
        boxShadow: '0 20px 0 0 #FAFAFA'
    },
    image: {
        width: '100%',
        height: 240,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    content: {
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    dates: {
        color: '#888',
        fontSize: 14,
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    location: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 20,
    },
    tag: {
        backgroundColor: '#E0E0E0',
        borderRadius: 16,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 22,
        color: '#444',
        marginBottom: 24,
    },
    contentItem: {
        marginBottom: 16,
        borderRadius: 12,
        backgroundColor: '#FFF',
        overflow: 'hidden',
        elevation: 2,
    },
    media: { width: '100%', height: 200 },
    noteInput: {
        padding: 12,
        backgroundColor: '#F0F0F0',
    },
    detailMedia: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },
    detailNote: {
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
        marginBottom: 16,
    },
    actionButton: {
        marginTop: 50,
        backgroundColor: '#101010',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    actionText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
