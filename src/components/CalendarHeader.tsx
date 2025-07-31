import { ReactNode } from "react";

interface CalendarHeaderProps {
    children: ReactNode;
}

export const CalendarHeader = ({ children }: CalendarHeaderProps) => {
    return (
        <div className="flex items-center justify-between p-4 border-b border-calendar-grid bg-card">
            {children}
        </div>
    );
};