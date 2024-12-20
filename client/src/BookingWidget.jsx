import { useContext, useEffect, useState } from "react"
import {differenceInCalendarDays} from "date-fns"
import axios from "axios"
import { Navigate } from "react-router"
import { UserContext } from "./UserContext"

export default function BookingWidget({place}){ //need to pass in place
    const [checkIn,setCheckIn]=useState('')
    const [checkOut,setCheckOut]=useState('')
    const [numberOfGuests,setNumberOfGuests]=useState('')
    const [name,setName]=useState('')
    const [phone,setPhone]=useState('')
    //redirect to booking
    const [redirect,setRedirect]=useState('')
    const {user}=useContext(UserContext) // presented as user based on usecontext.jsx
    
    useEffect(()=>{
        if (user){
            setName(user.name)
        }
    },[user])

    let numberOfNights=0;
    if (checkIn && checkOut){
        numberOfNights=differenceInCalendarDays(new Date(checkOut), new Date(checkIn))
    }
    async function bookThisPlace(){
        const response= await axios.post("/bookings",{
            checkIn,checkOut,numberOfGuests,name,phone,
            place:place._id, //need to be _id
            price:numberOfNights*place.price
        })
        const bookingId=response.data._id //because in index, we have just put in the whole doc
        setRedirect(`/account/booking/${bookingId}`)
    }

    if (redirect){
        return <Navigate to={redirect}/>
    }
    return (
        <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
        Price: ${place.price} / per night
        </div>
        <div className="border rounded-2xl mt-4 ">
            <div className="flex">
        <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date" 
            value={checkIn}
            onChange={ev=>setCheckIn(ev.target.value)}/>
        </div>
        <div className="py-3 px-4 border-t">
            <label>Check out:</label>
            <input type="date" 
            value={checkOut}
            onChange={ev=>setCheckOut(ev.target.value)}/>
        </div>
        </div>
            <div className="py-3 px-4 border-t">
            <label>Number of guests:</label>
            <input type="number" 
            value={numberOfGuests}
            onChange={ev=>setNumberOfGuests(ev.target.value)}/>
            </div>
            {numberOfNights > 0 && (
                 <div className="py-3 px-4 border-t">
                    <label>Your full name:</label>
                    <input type="text" 
                    value={name}
                    onChange={ev=>setName(ev.target.value)}/>
                    <label>Your phone number:</label>
                    <input type="tel" 
                    value={phone}
                    onChange={ev=>setPhone(ev.target.value)}/>
                    </div>
            )}
        </div>
        <button onClick={bookThisPlace} className="primary mt-4">
            Book this place
            {numberOfNights>0 && (
                <span> ${numberOfNights*place.price} </span>
            )}
        </button>
    </div>
    )
}