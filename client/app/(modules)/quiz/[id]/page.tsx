'use client'
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function attemptQuiz(){
    const params = useParams();
    const quiz_id = params.id
    const [quiz, setQuiz] = useState({
        title : '',
        description : '',
        created_by : '',
        question_ids : [],
        is_active : false,
        created_at : ''
    })
    const[currentQuestionIndex , setCurrentQuestionIndex] = useState(0);
    const[currentQuestion, setCurrentQuestion] = useState({
            question_test : '',
            options : [],
            correct_option : ''
    })
    useEffect(()=>{
        const getsingleQuiz = async () => {
            const res = await fetch(`http://localhost:8000/quiz/${quiz_id}`, {
                method : "GET",
                credentials : "include"
            })
            const data = await res.json();
            if(res.ok){
                setQuiz(data)
            }
        }
        getsingleQuiz()
    }, [])

    const fetchQuestion = async(questionId : string) => {
            const res = await fetch(`http://localhost:8000/question/${questionId}`, {
                method : 'GET',
                credentials : 'include'
            })
            const data = await res.json()
            setCurrentQuestion(data)
    }

    const handleNext =async() => {
        if(currentQuestionIndex < quiz.question_ids.length - 1){
            setCurrentQuestionIndex(currentQuestionIndex+1)
        }
    } 

    useEffect(()=>{
        if(quiz.question_ids.length > 0){
            fetchQuestion(quiz.question_ids[currentQuestionIndex])
        }
    }, [quiz.question_ids, currentQuestionIndex]);

    return(
        <div>
            {quiz_id}
            {quiz.title}
            {quiz.description}
            {/* {quiz.question_ids.map((q,idx)=>(
                <div key={idx}> {q}</div>
            ))} */}
            {quiz.is_active ? 'Active' : 'Inactive'}
            {quiz.created_at}
            {currentQuestion.question_test}
            {currentQuestion?.options?.map((opt,idx)=>(
                <div key={idx}> 
                    {opt}
                </div>
            ))}
            <button onClick={handleNext}>next</button>
        </div>
    )
}