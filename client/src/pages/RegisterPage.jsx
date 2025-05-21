import { useState } from "react"
import {Link} from "react-router-dom"
import axios from "axios"
export default function RegisterPage(){
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    async function registerUser(ev){ 
        ev.preventDefault() 
        try {
            await axios.post('/register', {
                name,
                email,
                password 
            }) 
            alert('Registration successful. Now you can log in')
        } catch (e) {
            alert('Registration failed. Try again later')
        }
    }
    return (
        <div className="mt-4 flex grow items-center justify-around">
        <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
            <input type="text" 
            value={name} 
            onChange={ev=>setName(ev.target.value)} placeholder="John Doe"/>
            <input type="email" 
            value={email} 
            onChange={ev=>setEmail(ev.target.value)}  placeholder="your@email.com"/>
            <input type="password" 
            value={password} 
            onChange={ev=>setPassword(ev.target.value)} 
            placeholder="password"/>
            <button className="primary">Register</button>
            <div className="text-center py-2 text-gray-500">
                Already have an account yet? <Link className="underline text-black" to="/login">Login</Link>
            </div>
        </form>
        </div>
    </div>
    )
}