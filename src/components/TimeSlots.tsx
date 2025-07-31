export const TimeSlots = () => {
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = new Date();
                time.setHours(hour, minute, 0);
                const timeString = time.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                });
                slots.push(timeString);
            }
        }
        return slots;
    };

    const timeSlots = generateTimeSlots();

    return (
        <div className="w-20 flex-shrink-0 border-r border-calendar-grid bg-muted/20">
            {timeSlots.map((time, index) => (
                <div
                    key={index}
                    className="h-[30px] flex items-start justify-end pr-2 text-xs text-calendar-time relative"
                >
                    {index % 2 === 0 && (
                        <span className="absolute -top-2">{time}</span>
                    )}
                </div>
            ))}
        </div>
    );
};