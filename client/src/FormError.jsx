export default function FormError({ message }) {
    if (!message) return null;
    
    return (
      <div className="text-red-500 text-sm mt-1">
        {message}
      </div>
    );
  }