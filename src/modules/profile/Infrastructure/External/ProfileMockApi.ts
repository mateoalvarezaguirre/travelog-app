import {ProfileManagement} from "@modules/profile/Domian/Contracts/ProfileManagement";
import {Profile} from "@modules/profile/Domian/Types/ProfileType";

export class ProfileMockApi implements ProfileManagement {

    private readonly defaultProfile: Profile = {
        id: '1',
        name: 'John Doe',
        email: 'test@test.com',
        bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    };

    async getProfile(): Promise<Profile> {
        const profile = this.defaultProfile

        profile.avatarUrl = this.getRandomAvatar(profile.email);

        return profile;
    }

    async updateProfile(data: Partial<Profile>): Promise<Profile> {
        return {
            ...this.defaultProfile,
            ...data,
        }
    }

    private getRandomAvatar(seed: string): string {
        return `https://api.dicebear.com/9.x/notionists/png?seed=${seed}`;
    }
}