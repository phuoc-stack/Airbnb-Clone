import { Link } from "react-router-dom";

export default function PlaceCard({ place }) {
  return (
    <Link to={'/place/' + place._id} className="block hover:shadow-lg transition-shadow">
      <div className="bg-gray-500 mb-2 rounded-2xl overflow-hidden aspect-square">
        {place.photos?.[0] && (
          <img 
            className="object-cover w-full h-full" 
            src={'http://localhost:4001/uploads/' + place.photos?.[0]} 
            alt={place.title}
          />
        )}
      </div>
      <h2 className="font-bold truncate">{place.title}</h2>
      <h3 className="text-sm text-gray-500 truncate">{place.address}</h3>
      <div className="mt-1">
        <span className="font-bold">${place.price}</span> per night
      </div>
    </Link>
  );
}