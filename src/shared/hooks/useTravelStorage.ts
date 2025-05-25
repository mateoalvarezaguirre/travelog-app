import {useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {TravelEntry} from "@modules/travel/domain/Types/TravelEntry";
import {mockTravelData} from "@modules/travel/infrastructure/mockTravelData";
import {delay} from "@shared/utils/delay";
import UuidGenerator from "@shared/utils/uuidGenerator";

const STORAGE_KEY = 'travelog.trips';

export function useTravelStorage() {
    const [trips, setTrips] = useState<TravelEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrips().then();
    }, []);


    const loadTrips = async () => {
        try {
            setLoading(true);

            const storedTrips = await AsyncStorage.getItem(STORAGE_KEY);

            if (storedTrips && Object.keys(JSON.parse(storedTrips)).length !== 0) {
                setTrips(JSON.parse(storedTrips));
            } else {
                await saveTrips(mockTravelData);
            }
        } catch (error) {
            console.error('Error fetching trips from storage:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveTrips = async (updated: TravelEntry[]) => {
        try {
            setLoading(true);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            setTrips(updated);
        } catch (e) {
            console.error('Error saving trips', e);
        } finally {
            setLoading(false);
        }
    };

    const addTrip = async (trip: TravelEntry) => {
        setLoading(true);

        await delay(1000);

        if (!trip.id) {
            trip.id = UuidGenerator.generate();
        }

        const updated = [trip, ...trips];
        await saveTrips(updated);
        setLoading(false);
    };

    const removeTrip = async (tripId: string) => {
        setLoading(true);

        await delay(1000);

        const updated = trips.filter(trip => trip.id !== tripId);
        await saveTrips(updated);

        setLoading(false);
    }

    return {
        loadTrips,
        trips,
        addTrip,
        removeTrip,
        loading,
    };
}