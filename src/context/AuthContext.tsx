import React, {createContext, useEffect, useMemo, useState} from 'react';
import * as SecureStore from 'expo-secure-store';
import TravelogLoader from "@shared/ui/TravelogLoader";

export interface AuthContextType {
    userToken: string | null;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    userToken: null,
    signIn: async () => {},
    signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const token = await SecureStore.getItemAsync('userToken');
            setUserToken(token);
            setIsLoading(false);
        })();
    }, []);

    const authContext = useMemo(
        () => ({
            userToken,
            signIn: async (token: string) => {
                await SecureStore.setItemAsync('userToken', token);
                setUserToken(token);
            },
            signOut: async () => {
                await SecureStore.deleteItemAsync('userToken');
                setUserToken(null);
            },
        }),
        [userToken]
    );

    if (isLoading) {
        return <TravelogLoader message="Cargando aplicación…" />;
    }

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
}
