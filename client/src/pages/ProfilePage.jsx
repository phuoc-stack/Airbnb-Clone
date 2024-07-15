import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom"
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";

export default function ProfilePage(){
    const [redirect,setRedirect]=useState(null) //set state to redirect to homepage 
    const {ready,user,setUser}=useContext(UserContext) 
    let {subpage}=useParams();//get the "subpage" parameter from the URL
    if (subpage===undefined){
        subpage="profile"
    }

    async function logout(){
        await axios.post('/logout') //path to log out
        setRedirect('/') //set state of redirect to homepage
        setUser(null) //without this, we are still logged in 2:06. 
    }

    if (!ready){
        return 'Loading...' //still loading
    }

    if (ready && !user &&!redirect){ //user is null. add !!redirect at 2:09 so that we are not redirected to log in after logging out
        return <Navigate to={"/login"} />
    }
    
    if (redirect){
        return <Navigate to={redirect} /> 
    }
    return(
        <div>
            <AccountNav />
            {subpage ==='profile' &&( //in sub-page profile render following details
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email})<br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {/* account page for {user?.name} // to test, delete it later ? means optional*/}
            {subpage==='places'&&(
                <PlacesPage />
            )}
        </div>
    )
}
