'use client'
import { useEffect, useState } from "react"


export default function Profile(){
const [profile, setProfile] = useState<any>(null)
    useEffect(()=>{
        const getProfile = async () => {
            const data = await fetch("http://localhost:8000/profile", {credentials : 'include'})
            const response =  await data.json()
            setProfile(response);
        }
        getProfile()
    }, [])
    return(
        <div>
          <h1>Profile</h1>
          <div>
            {profile ? (
                <div>
                    <span>{profile.username}</span>
                    <span>{profile.email}</span>
                </div>
            ) : (
                <div>Loading profile...</div>
            )}
          </div>
        </div>
    )
}