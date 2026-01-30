'use client'
import { useParams } from "next/navigation"
import { useState } from "react"
import { useEffect } from "react"
export default function createQuestions(){
    const params = useParams()
    const[questions, setQuestions] = useState([{
        question_test : '',
        options : [],
        correct_option : ''
    }])
    const[name , setName] = useState('')
    const quiz_id = params.id
    useEffect(()=>{
        const fetchQuizName = async () =>{
            const res = await fetch(`http://localhost:8000/quiz/${quiz_id}`, {
                method : "GET",
                credentials : "include"
            })
            const data = await res.json();
            setName(data.title)

        }
        fetchQuizName();
    }, [])

    const handleSubmit = async (e : any) =>{
        e.preventDefault();
        const res = await fetch(`http://localhost:8000/quiz/update/${quiz_id}`, {
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json"
            },
            credentials : "include",
            body : JSON.stringify(questions)
        })
    }
return(
    <div>
       create question for "{name}" QUIZ
        <div>
        <form onSubmit={handleSubmit}>
         {questions.map((q,idx)=>(
            <div key={idx}>

             <input type="text" placeholder="Enter Question" value={questions[idx].question_test} onChange={(e)=>{
                const updated = [...questions];
                updated[idx].question_test = e.target.value
                setQuestions(updated)
            }} />


                
            </div>
         ))}
         <button type="button" onClick={()=> setQuestions([...questions, {question_test : '', 
            options : [],  correct_option : ''
         }])}>
            add another question
         </button>
         <button type="submit">
            submit
         </button>
        </form>
        </div>
    </div>
)
}