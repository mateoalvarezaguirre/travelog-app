import uuid from "react-native-uuid";

class UuidGenerator {
    static generate(): string {
        return uuid.v4();
    }
}

export default UuidGenerator;