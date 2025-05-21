import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import PlaceImg from "./PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import BookingDates from "../BookingDates";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div>
        <AccountNav />
        <div className="text-center mt-8">Loading your bookings...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8">
      <AccountNav />
      <div className="mt-8">
        {bookings?.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Link
                key={booking._id}
                to={`/account/bookings/${booking._id}`}
                className="flex flex-col sm:flex-row gap-4 bg-gray-200 rounded-2xl overflow-hidden"
              >
                <div className="w-full sm:w-48 h-48 sm:h-auto">
                  <PlaceImg
                    place={booking.place}
                    className="w-full h-full object-cover aspect-square"
                  />
                </div>
                <div className="py-3 px-4 grow flex flex-col">
                  <h2 className="text-xl font-semibold mb-2">{booking.place.title}</h2>
                  <BookingDates
                    booking={booking}
                    className="mb-2 mt-2 text-gray-700 text-sm sm:text-base"
                  />
                  <div className="flex items-center gap-1 mt-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                      <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                    </svg>
                    <span className="text-lg sm:text-xl font-semibold">
                      Total: ${booking.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center bg-gray-100 p-8 rounded-2xl">
            <h2 className="text-xl mb-4">You have no bookings yet</h2>
            <Link to="/" className="bg-primary text-white py-2 px-6 rounded-full inline-block">
              Explore places to stay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}