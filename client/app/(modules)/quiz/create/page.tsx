'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CreateQuiz(){
    const router = useRouter()
    const [form, setForm] = useState({
        title : '',
        description : '',
        is_active: false,
        
    })
        const handleSubmit = async (e : any)=>{
            e.preventDefault();
            const res = await fetch("http://localhost:8000/quiz/create", {
                method : "POST",
                headers : {
                    'Content-Type' : "application/json"
                },
                credentials : "include",
                body  : JSON.stringify(form)
            })
            const data = await res.json();
            setForm({
                title : '',
                description : '',
                is_active : false
            })
            router.push(`/quiz/create/${id}`)
        }

    
    return(
        <div>
            create your own quiz
            <div>
                <form action="" onSubmit={handleSubmit}>

                    <input type="text" placeholder="title of quiz" value={form.title} onChange={(e)=>setForm({...form, title : e.target.value})} />
                    <input type="text" placeholder="description of quiz" value={form.description} onChange={(e)=>setForm({...form, description : e.target.value})} />

                    <input type="checkbox" 
                    checked={form.is_active} onChange={(e)=>setForm({...form, is_active : e.target.checked})} />
                    <span>{form.is_active ? 'True' : 'False'}</span>
                    <button type="submit">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    )
}