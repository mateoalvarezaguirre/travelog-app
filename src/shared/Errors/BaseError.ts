export class BaseError extends Error {
    private readonly title: string;
    private readonly errorMessage: string;

    constructor(title: string, errorMessage: string, message?: string) {
        super(message ?? title);
        this.title = title;
        this.errorMessage = errorMessage;
        this.name = "BaseError";
        Object.setPrototypeOf(this, BaseError.prototype);
    }

    getTitle(): string {
        return this.title;
    }

    getErrorMessage(): string {
        return this.errorMessage;
    }
}

export default BaseError;