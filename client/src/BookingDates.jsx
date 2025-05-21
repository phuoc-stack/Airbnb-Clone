import { differenceInCalendarDays, format } from "date-fns";

export default function BookingDates({ booking, className }) {

  const nights = differenceInCalendarDays(
    new Date(booking.checkOut),
    new Date(booking.checkIn)
  );
  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
        </svg>
        <span className="text-base sm:text-lg">Number of night(s): {nights}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                {/* Check-in date */}
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 flex-shrink-0">
                        <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75ZM3.75 11.25h16.5v7.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-7.5Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base sm:text-lg">{format(new Date(booking.checkIn), "yyyy-MM-dd")}</span>
                </div>
                
                {/* Arrow */}
                <div className="mx-2 text-gray-500">→</div>
                
                {/* Check-out date */}
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 flex-shrink-0">
                        <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75ZM3.75 11.25h16.5v7.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-7.5Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-base sm:text-lg">{format(new Date(booking.checkOut), "yyyy-MM-dd")}</span>
                </div>
            </div>
        </div>
    );
}