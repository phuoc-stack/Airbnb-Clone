import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios"
import PlaceImg from "./PlaceImg";

export default function PlacesPage() {
  const [places,setPlaces]=useState([])
    useEffect(()=>{
      axios.get('/user-places').then(({data})=>{
        setPlaces(data)
      })
    },[])
  return (
    <div>
        <AccountNav />
        <div className="text-center">
          <Link
            className="inline-flex bg-primary text-white py-2 rounded-full px-6"
            to={"/account/places/new"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            Add new place
          </Link>
        </div>
      <div className="mt-4">
        {places.length>0 && places.map(place=>(
          <Link key={place._id} to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl">
            <div className="flex w-36 h-36 bg-gray-300 grow shrink-0"> 
                <PlaceImg place={place} />
            </div>
            <div className="grow-0 shrink">
              <h2 className="text-xl">{place.title}</h2>
              <p className="text-sm mt-2">{place.description}</p>
            </div>
          </Link>
    ))}
      </div>
    </div>
  );
}
