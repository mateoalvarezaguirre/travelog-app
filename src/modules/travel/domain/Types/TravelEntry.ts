import {ContentItem} from "@modules/travel/domain/Types/ContentItem";


export type TravelEntry = {
    id: string;
    title: string;
    location: string;
    description: string;
    coverPicture: string;
    dateStart: string;
    dateEnd: string;
    content: ContentItem[];
    tags: string[];
};