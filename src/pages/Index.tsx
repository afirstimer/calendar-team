import { Calendar } from "@/components/Calendar";
import { useAuth } from "../context/AuthContext";
import { AuthForm } from "../components/AuthForm";

const Index = () => {
    const { user } = useAuth();
    if (!user) {
        return <AuthForm />;
    }
    return <Calendar user={user} />;
};

export default Index;