export default function PlaceImg({place,index=0,className=null}){
    if (!place.photos?.length){
        return ''; 
    }
    if (!className){
        className='object-cover overflow-hidden w-48'
    }
    return (
            <img className={className} src={`http://localhost:4001/uploads/${place.photos[index]}`} alt="Place" />
    )
}