import { useEffect, useState } from "react";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router";
import FormError from "../FormError"
import axios from "axios";

export default function PlacesFormPage() {
  const { id } = useParams()
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!id) {
      return
    }
    axios.get('/places/' + id).then(response => {
      const { data } = response
      setTitle(data.title)
      setAddress(data.address)
      setAddedPhotos(data.photos)
      setDescription(data.description)
      setPerks(data.perks)
      setExtraInfo(data.extraInfo)
      setCheckIn(data.checkIn)
      setCheckOut(data.checkOut)
      setMaxGuests(data.maxGuests)
      setPrice(data.price)
    })
  }, [id])

  function validateForm() {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!checkIn || checkIn.trim() === '') {
      newErrors.checkIn = 'Check-in time is required (e.g., 14 for 2 PM)';
    } else if (isNaN(parseInt(checkIn)) || parseInt(checkIn) < 0 || parseInt(checkIn) > 23) {
      newErrors.checkIn = 'Check-in time must be a number between 0-23';
    }

    if (!checkOut || checkOut.trim() === '') {
      newErrors.checkOut = 'Check-out time is required (e.g., 11 for 11 AM)';
    } else if (isNaN(parseInt(checkOut)) || parseInt(checkOut) < 0 || parseInt(checkOut) > 23) {
      newErrors.checkOut = 'Check-out time must be a number between 0-23';
    }

    if (!maxGuests || parseInt(maxGuests) < 1) {
      newErrors.maxGuests = 'At least 1 guest is required';
    }

    if (!price || parseFloat(price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (addedPhotos.length === 0) {
      newErrors.photos = 'At least one photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }
  async function savePlace(ev) {
    ev.preventDefault();
    setErrors({});

    if (!validateForm()) {
      addToast('Please fix the form errors below', 'error');
      return;
    }

    const placeData = {
      title, address, addedPhotos,
      description, perks, extraInfo,
      checkIn: parseInt(checkIn),
      checkOut: parseInt(checkOut),
      maxGuests: parseInt(maxGuests),
      price: parseFloat(price)
    }
    if (id) {
      await axios.put('/places', {
        id, ...placeData
      })
      setRedirect(true)
    } else {
      await axios.post('/places', placeData)
      setRedirect(true)
    }
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />
  }

  return (
    <div>
      <AccountNav />
      <form onSubmit={savePlace}>
        {preInput("Title", "title, for example: My lovely apt")}
        <input
          type="text"
          value={title}
          onChange={ev => setTitle(ev.target.value)}
          placeholder="title, for example, my lovely apartment"
          className={errors.title ? 'border-red-500' : ''}
        />
        <FormError message={errors.title} />

        {preInput("Address", "Address to this place")}
        <input type="text"
          value={address}
          onChange={ev => setAddress(ev.target.value)}
          placeholder="address"
          className={errors.address ? 'border-red-500' : ''}
        />
        <FormError message={errors.address} />

        {preInput("Photos", "more=better")}
        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
        <FormError message={errors.photos} />

        {preInput('Description', 'description of the place')}
        <textarea
          value={description}
          onChange={ev => setDescription(ev.target.value)}
          className={errors.description ? 'border-red-500' : ''}
        />
        <FormError message={errors.description} />

        {preInput('Perks', 'select all the perks of your place')}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput('Extra info', 'house rules, etc')}
        <textarea
          value={extraInfo}
          onChange={ev => setExtraInfo(ev.target.value)}
        />

        {preInput('Check in and check out times, max guests', 'add check in and out times, remember to have some time window for cleaning between guests')}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input type="text"
              value={checkIn}
              onChange={ev => setCheckIn(ev.target.value)}
              placeholder="14"
              className={errors.checkIn ? 'border-red-500' : ''}
            />
            <FormError message={errors.checkIn} />
          </div>

          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input type="text"
              value={checkOut}
              onChange={ev => setCheckOut(ev.target.value)}
              placeholder="11"
              className={errors.checkOut ? 'border-red-500' : ''}
            />
            <FormError message={errors.checkOut} />
          </div>

          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
              min="1"
              className={errors.maxGuests ? 'border-red-500' : ''}
            />
            <FormError message={errors.maxGuests} />
          </div>

          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              className={errors.price ? 'border-red-500' : ''}
            />
            <FormError message={errors.price} />
          </div>

        </div>
        <div className="flex justify-center mt-4 mb-8">
          <button className=" primary my-4 py-2 px-6 max-w-xs mx-auto">Save</button>
        </div>
      </form>
    </div>
  )
}