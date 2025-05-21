import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useToast } from "../ToastContext"
import FormError from "../FormError"

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast()

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
            setLoading(true);
            await axios.post('/register', {
                name,
                email,
                password
            })
            addToast('Registration successful. Now you can log in', 'success')
            setName('')
            setEmail('')
            setPassword('')
        } catch (e) {
            if (e.response && e.response.data && e.response.data.errors) {
                // Handle server validation errors
                const serverErrors = {};
                e.response.data.errors.forEach(err => {
                    serverErrors[err.param] = err.msg;
                });
                setErrors(serverErrors);
            } else {
                addToast('Registration failed. Try again later', 'error')
            }
        }
        finally {
            setLoading(false)
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
                    <FormError message={errors.name} />
                    <input type="email"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)} placeholder="your@email.com" />
                    <FormError message={errors.email} />
                    <input type="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                        placeholder="password" />
                     <FormError message={errors.password} />
                     <button className="primary" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    <div className="text-center py-2 text-gray-500">
                        Already have an account yet? <Link className="underline text-black" to="/login">Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}