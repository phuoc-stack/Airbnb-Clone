import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const query = searchParams.get('query') || '';

    useEffect(() => {
        searchPlaces({ query });
    }, [query]);

    async function searchPlaces(filters = {}) {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axios.get("/places");
      
      // Filter places based on search query
      let filteredPlaces = data;
      
      if (query) {
        filteredPlaces = data.filter(place => 
          place.title?.toLowerCase().includes(query.toLowerCase()) ||
          place.address?.toLowerCase().includes(query.toLowerCase()) ||
          place.description?.toLowerCase().includes(query.toLowerCase())
        );
      }  
      setPlaces(filteredPlaces);
    } catch (err) {
      console.error("Error searching:", err);
      setError("Failed to load places");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {query ? `Search results for "${query}"` : 'All Places'}
      </h1>
      
      {loading ? (
        <div className="text-center p-8">Loading...</div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-lg text-red-700">{error}</div>
      ) : (
        <div className="mt-8 grid gap-8 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {places.length > 0 ? places.map(place => (
            <Link key={place._id} to={'/place/'+place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.photos?.[0] && (
                  <img className="rounded-2xl object-cover aspect-square" src={'http://localhost:4001/uploads/'+place.photos?.[0]} />
                )}
              </div>
              <h2 className="font-bold">{place.title}</h2>
              <h3 className="text-sm text-gray-500">{place.address}</h3>
              <div className="mt-1">
                <span className="font-bold">${place.price}</span> per night
              </div>
            </Link>
          )) : (
            <div className="col-span-full text-center">
              <p>No places found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}