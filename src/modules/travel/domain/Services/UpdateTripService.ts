import {TravelEntry} from "@modules/travel/domain/Types/TravelEntry";
import {MissingDataError} from "@modules/travel/domain/Errors/MissingDataError";

export class UpdateTripService {

    async updateTrip(originalTrip: TravelEntry, updatedTrip: TravelEntry): Promise<TravelEntry> {

        if (!updatedTrip.title || !updatedTrip.location || !updatedTrip.description || !updatedTrip.photos.length || !updatedTrip.dateStart || !updatedTrip.dateEnd) {
            throw new MissingDataError();
        }

        if (updatedTrip.dateEnd < updatedTrip.dateStart) {
            throw new Error('La fecha de fin debe ser posterior a la de inicio.');
        }

        // Check if the updated trip is different from the original
        if (JSON.stringify(originalTrip) === JSON.stringify(updatedTrip)) {
            throw new Error('No se han realizado cambios en el viaje.');
        }

        return updatedTrip;
    }
}