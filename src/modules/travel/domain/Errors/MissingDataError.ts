import {BaseError} from "@shared/Errors/BaseError";

export class MissingDataError extends BaseError {

    constructor() {
        super(
            'Faltan datos',
            'Por favor, completa todos los campos.',
        );
        this.name = "MissingDataError";
        Object.setPrototypeOf(this, MissingDataError.prototype);
    }
}