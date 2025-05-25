import {Profile} from "@modules/profile/Domian/Types/ProfileType";

export interface ProfileManagement {
    getProfile(): Promise<Profile>;

    updateProfile(data: Partial<Profile>): Promise<Profile>;
}