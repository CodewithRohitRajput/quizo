'use client'

import { useState } from "react"

export default function Login(){
    const[form, setForm] = useState({
        email : "",
        password : ""
    })
    const[response , setResponse] = useState<string>("")
    const handleLogin = async (e : any) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8000/auth/login`, {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(form),
            credentials : "include"
        })
        const response = await res.json();
        if(response.message){
            setResponse(response.message)
        }
        else if(response.detail){
            setResponse(response.detail)
        }
    }

    return(
        <div>
            <div>
                <h1>Login</h1>
                <input type="email" placeholder="Email"
                value={form.email} onChange={(e)=>setForm({...form, email :e.target.value})}/>
                <input type="password" placeholder="Password"
                value={form.password} onChange={(e)=>setForm({...form, password :e.target.value})}/>
                <button onClick={handleLogin}>
                    create account
                </button>
                {response}
            </div>
        </div>
    )
}