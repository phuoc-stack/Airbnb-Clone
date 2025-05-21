import axios from "axios";
import { useContext, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { UserContext } from "../UserContext"
import { useToast } from "../ToastContext"
import FormError from "../FormError"

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const { setUser } = useContext(UserContext)
    const { addToast } = useToast();

    async function handleLoginSubmit(ev) {
        ev.preventDefault();

        if (!email) {
            setError('Email is required')
            return;
        }

        if (!password) {
            setError('Password is required')
            return;
        }

        try {
            setError('');
            setLoading(true);
            const response = await axios.post('/login', { email, password })
            setUser(response.data)
            addToast('Login successful', 'success')
            setRedirect(true)
        } catch (e) {
            if (e.response?.status === 422) {
                setError('Invalid password');
            } else if (e.response?.data === 'not found') {
                setError('User not found with this email');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />
    }

    return (
        <div className="mt-4 flex grow items-center justify-around">
            <div className="mb-64">
                <h1 className="text-4xl text-center mb-4">Login</h1>
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}
                <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
                    <input type="email" placeholder="your@email.com"
                        value={email}
                        onChange={ev => setEmail(ev.target.value)} />
                    <input type="password" placeholder="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)} />
                    <button className="primary">Login</button>
                    <div className="text-center py-2 text-gray-500">
                        Don't have an account yet? <Link className="underline text-black" to="/register">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}