import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({});

    function validateForm() {
        const newErrors = {};

        if (!name) newErrors.name = 'Name is required';
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        else if (!/[A-Z]/.test(password)) newErrors.password = 'Password must contain at least one uppercase letter';
        else if (!/[a-z]/.test(password)) newErrors.password = 'Password must contain at least one lowercase letter';
        else if (!/[0-9]/.test(password)) newErrors.password = 'Password must contain at least one number';

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function registerUser(ev) {
        ev.preventDefault();

        if (!validateForm()) return

        try {
            await axios.post('/register', {
                name,
                email,
                password
            })
            alert('Registration successful. Now you can log in')
        } catch (e) {
            if (e.response && e.response.data && e.response.data.errors) {
                // Handle server validation errors
                const serverErrors = {};
                e.response.data.errors.forEach(err => {
                    serverErrors[err.param] = err.msg;
                });
                setErrors(serverErrors);
            } else {
                alert('Registration failed. Try again later')
            }
        }
    }
    return (
        <div className="mt-4 flex grow items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input type="text"
                        value={name}
                        onChange={ev => setName(ev.target.value)} placeholder="John Doe" />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                    <input type="email"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)} placeholder="your@email.com" />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                    <input type="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        placeholder="password" />
                    {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already have an account yet? <Link className="underline text-black" to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}