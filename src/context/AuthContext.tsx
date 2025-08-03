import { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from "firebase/auth";
import { ref, onDisconnect, set, serverTimestamp } from "firebase/database";
import { auth, rtdb } from "../lib/firebase"; // import rtdb (Realtime DB)

interface AuthContextType {
    user: User | null;
    signup: (email: string, password: string) => Promise<void>;
    signin: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    signup: async () => { },
    signin: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                const statusRef = ref(rtdb, `/status/${firebaseUser.uid}`);

                // Mark as online
                set(statusRef, {
                    state: "online",
                    lastChanged: serverTimestamp(),
                });

                // Mark as offline on disconnect
                onDisconnect(statusRef).set({
                    state: "offline",
                    lastChanged: serverTimestamp(),
                });
            }
        });

        return () => unsubscribe();
    }, []);

    const signup = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle presence
    };

    const signin = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle presence
    };

    const logout = async () => {
        // if (user) {
        //     const statusRef = ref(rtdb, `/status/${user.uid}`);
        //     await set(statusRef, {
        //         state: "offline",
        //         lastChanged: serverTimestamp(),
        //     });
        // }

        await signOut(auth);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signup, signin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
