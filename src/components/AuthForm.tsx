import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export const AuthForm = () => {
    const [isSignup, setIsSignup] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        name: "", // for signup
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignup) {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    form.email,
                    form.password
                );

                await updateProfile(userCredential.user, {
                    displayName: form.name,
                });

                // 🔽 Save user to Firestore
                await setDoc(doc(db, "users", userCredential.user.uid), {
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                    name: form.name,
                    isAdmin: false,
                });
            } else {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    form.email,
                    form.password
                );

                console.log("Signed in:", userCredential.user);
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed.");
        } finally {
            setForm({ email: "", password: "", name: "" });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">
                    {isSignup ? "Create Account" : "Welcome Back"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                            required
                        />
                    )}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none"
                        required
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? "Please wait..." : isSignup ? "Sign Up" : "Log In"}
                    </button>
                </form>

                <p className="text-sm text-center mt-4 text-muted-foreground">
                    {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                    <button
                        type="button"
                        className="text-blue-600 hover:underline ml-1"
                        onClick={() => setIsSignup((prev) => !prev)}
                    >
                        {isSignup ? "Log in" : "Sign up"}
                    </button>
                </p>
            </div>
        </div>
    );
};
