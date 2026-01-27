'use client'

import { useState } from "react"

export default function Signup(){
    const[form, setForm] = useState({
        username : "",
        email : "",
        password : ""
    })

    const handleSignup = async (e : any) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8000/auth/signup`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(form)
        })
        const response = await res.json();
    }

    return(
        <div>
            Signup pls man
        </div>
    )
}