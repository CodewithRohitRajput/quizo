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
    const [queId, addQueId] = useState([])
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
      const quiz_id = params.id
      const questionsWithQuizId = questions.map(q=>({

          ...q,
          quiz_id
        }
        ))
      const res = await fetch(`http://localhost:8000/question`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        credentials : "include",
        body : JSON.stringify(questionsWithQuizId)
      })
      const data = await res.json();
      const quizRes = await fetch( `http://localhost:8000/quiz/${quiz_id}` , {
        method : "GET",
        credentials : "include"
      })
      const quizData = await quizRes.json();
      quizData.question_ids = data.ids;
      const update = await fetch(`http://localhost:8000/quiz/update/${quiz_id}`, {
        method : "PATCH",
        headers :{
            "Content-Type" : "application/json"
        },
        credentials :"include",
        body : JSON.stringify(quizData)
      })
    }
return(
    <div>
       create question for "{name}" QUIZ
        <div>
        <form onSubmit={handleSubmit}>
         {questions.map((q, idx) => (

            <div key={idx} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
              <input
                type="text"
                placeholder="Enter Question"
                value={q.question_test}
                onChange={e => {
                  const updated = [...questions];
                  updated[idx].question_test = e.target.value;
                  setQuestions(updated);
                }}
              />
              <div>

                {Array.from({ length: 4 }).map((_, optIdx) => (
                  <input
                    key={optIdx}
                    type="text"
                    placeholder={`Option ${optIdx + 1}`}
                    value={q.options[optIdx] || ""}
                    onChange={e => {
                      const updated = [...questions];
                      updated[idx].options[optIdx] = e.target.value;
                      setQuestions(updated);
                    }}
                    style={{ marginRight: "6px" }}
                  />
                ))}
              </div>

              <div>
                <label>Correct Option: </label>
                <select
                  value={q.correct_option}
                  onChange={e => {
                    const updated = [...questions];
                    updated[idx].correct_option = e.target.value;
                    setQuestions(updated);
                  }}
                >
                  <option value="">Select</option>
                  {q.options.map((opt, optIdx) => (
                    <option key={optIdx} value={opt}>
                      {opt || `Option ${optIdx + 1}`}
                    </option>

                  ))}
                </select>
              </div>
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