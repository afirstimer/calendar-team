import { onAuthStateChanged } from "firebase/auth";
import { ref, onDisconnect, set, serverTimestamp } from "firebase/database";
import { auth, rtdb } from "@/lib/firebase";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userStatusRef = ref(rtdb, `/status/${user.uid}`);

    // Set user online
    set(userStatusRef, {
      state: "online",
      lastChanged: serverTimestamp(),
    });

    // Set user offline when disconnect
    onDisconnect(userStatusRef).set({
      state: "offline",
      lastChanged: serverTimestamp(),
    });
  }
});
