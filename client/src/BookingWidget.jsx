import { useContext, useEffect, useState } from "react"
import { differenceInCalendarDays } from "date-fns"
import axios from "axios"
import { Navigate } from "react-router"
import { UserContext } from "./UserContext"

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState('')
    const [checkOut, setCheckOut] = useState('')
    const [numberOfGuests, setNumberOfGuests] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [redirect, setRedirect] = useState('')
    const [bookingInProgress, setBookingInProgress] = useState(false);
    const { user } = useContext(UserContext)
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        if (user) {
            setName(user.name)
        }
    }, [user])

    let numberOfNights = 0;
    if (checkIn && checkOut) {
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    }

    function validateBookingForm() {
        const errors = {};

        if (!checkIn) errors.checkIn = 'Check-in date is required';
        if (!checkOut) errors.checkOut = 'Check-out date is required';
        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);

            if (checkOutDate <= checkInDate) {
                errors.checkOut = 'Check-out date must be after check-in date';
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (checkInDate < today) {
                errors.checkIn = 'Check-in date cannot be in the past';
            }
        }

        if (!numberOfGuests) errors.numberOfGuests = 'Number of guests is required';
        else if (numberOfGuests < 1) errors.numberOfGuests = 'At least one guest is required';
        else if (numberOfGuests > place.maxGuests) {
            errors.numberOfGuests = `Maximum ${place.maxGuests} guests allowed`;
        }

        if (numberOfNights > 0) {
            if (!name) errors.name = 'Name is required';
            if (!phone) errors.phone = 'Phone number is required';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    async function bookThisPlace() {
        if (!validateBookingForm()) {
            return;
        }

        try {
            const response = await axios.post("/bookings", {
                checkIn, checkOut, numberOfGuests, name, phone,
                place: place._id,
                price: numberOfNights * place.price
            })
            const bookingId = response.data._id
            setRedirect(`/account/bookings/${bookingId}`)
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                // Handle server validation errors
                const serverErrors = {};
                error.response.data.errors.forEach(err => {
                    serverErrors[err.param] = err.msg;
                });
                setFormErrors(serverErrors);
            } else {
                alert('Booking failed. Please try again.');
            }
        }
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }
    return (
        <div className="bg-white shadow p-4 rounded-2xl">
          <div className="text-xl sm:text-2xl text-center">
            Price: ${place.price} / night
          </div>
          <div className="border rounded-2xl mt-4">
            <div className="flex flex-col sm:flex-row">
              <div className="py-3 px-4 w-full">
                <label className="block mb-1">Check in:</label>
                <input 
                  type="date" 
                  value={checkIn}
                  onChange={ev => setCheckIn(ev.target.value)}
                  className="w-full"
                />
                {formErrors.checkIn && (
                  <div className="text-red-500 text-sm mt-1">{formErrors.checkIn}</div>
                )}
              </div>
              <div className="py-3 px-4 border-t sm:border-t-0 sm:border-l w-full">
                <label className="block mb-1">Check out:</label>
                <input 
                  type="date" 
                  value={checkOut}
                  onChange={ev => setCheckOut(ev.target.value)}
                  className="w-full"
                />
                {formErrors.checkOut && (
                  <div className="text-red-500 text-sm mt-1">{formErrors.checkOut}</div>
                )}
              </div>
            </div>
            <div className="py-3 px-4 border-t">
              <label className="block mb-1">Number of guests:</label>
              <input 
                type="number" 
                value={numberOfGuests}
                min={1}
                max={place.maxGuests || 10}
                onChange={ev => setNumberOfGuests(parseInt(ev.target.value))}
                className="w-full"
              />
              {formErrors.numberOfGuests && (
                <div className="text-red-500 text-sm mt-1">{formErrors.numberOfGuests}</div>
              )}
            </div>
            {numberOfNights > 0 && (
              <div className="py-3 px-4 border-t">
                <label className="block mb-1">Your full name:</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={ev => setName(ev.target.value)}
                  className="w-full"
                />
                {formErrors.name && (
                  <div className="text-red-500 text-sm mt-1">{formErrors.name}</div>
                )}
                <label className="block mb-1 mt-3">Your phone number:</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={ev => setPhone(ev.target.value)}
                  className="w-full"
                />
                {formErrors.phone && (
                  <div className="text-red-500 text-sm mt-1">{formErrors.phone}</div>
                )}
              </div>
            )}
          </div>
          <button 
            onClick={bookThisPlace} 
            disabled={bookingInProgress}
            className={`primary mt-4 w-full py-3 ${bookingInProgress ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {bookingInProgress ? 'Booking...' : (
              <>
                Book this place
                {numberOfNights > 0 && (
                  <span> ${numberOfNights * place.price}</span>
                )}
              </>
            )}
          </button>
        </div>
      );
    }