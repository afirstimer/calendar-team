import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Person } from "./Calendar";
import { useEffect, useState } from "react";
import { ref, onValue, off } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

interface UserListProps {
    people: Person[];
    onUserClick: (userId: string) => void;
}

export const UserList = ({ people, onUserClick }: UserListProps) => {
    const { user } = useAuth();
    const currentUserId = user?.uid;
    const isAdmin = people.find((p) => p.id === currentUserId)?.isAdmin ?? false;

    const [onlineStatus, setOnlineStatus] = useState<Record<string, boolean>>({});
    const [visiblePeople, setVisiblePeople] = useState<Person[]>([]);

    useEffect(() => {
        if (!currentUserId) return;

        if (isAdmin) {
            // 👑 Admin: Listen to all online users
            const statusRef = ref(rtdb, "/status");
            const unsubscribe = onValue(statusRef, (snapshot) => {
                const data = snapshot.val();
                const result: Record<string, boolean> = {};

                if (data) {
                    for (const uid in data) {
                        result[uid] = data[uid].state === "online";
                    }
                }

                setOnlineStatus(result);
                // Optionally fetch full user list from DB, or just assume people list is everyone
                setVisiblePeople(people);
            });

            return () => off(statusRef, "value", unsubscribe);
        } else {
            // 👤 Non-admin: Listen only to teammates in `people`
            const unsubscribers: Array<() => void> = [];

            people.forEach((person) => {
                const statusRef = ref(rtdb, `/status/${person.id}`);
                const listener = onValue(statusRef, (snapshot) => {
                    const val = snapshot.val();
                    setOnlineStatus((prev) => ({
                        ...prev,
                        [person.id]: val?.state === "online",
                    }));
                });
                unsubscribers.push(() => off(statusRef, "value", listener));
            });

            setVisiblePeople(people);

            return () => unsubscribers.forEach((unsub) => unsub());
        }
    }, [people, isAdmin, currentUserId]);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Team:</span>
            <div className="flex gap-2">
                {visiblePeople.map((person) => {
                    const isOnline = onlineStatus[person.id] ?? false;
                    return (
                        <div
                            key={person.id}
                            className="relative cursor-pointer"
                            onClick={() => onUserClick(person.id)}
                            title={`View ${person.name}'s tasks`}
                        >
                            <Avatar className="h-8 w-8 border-2 border-background">
                                <AvatarFallback className="text-xs font-medium">
                                    {getInitials(person.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div
                                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${isOnline ? "bg-green-500" : "bg-gray-400"
                                    }`}
                            />
                        </div>
                    );
                })}

            </div>
        </div>
    );
};