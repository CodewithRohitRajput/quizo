'use client'
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, User, BookOpen } from 'lucide-react'

export default function attemptQuiz(){
    const params = useParams();
    const router = useRouter();
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
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const getsingleQuiz = async () => {
            try {
                const res = await fetch(`http://localhost:8000/quiz/${quiz_id}`, {
                    method : "GET",
                    credentials : "include"
                })
                const data = await res.json();
                if(res.ok){
                    setQuiz(data)
                }
            } catch (error) {
                console.error("Failed to load quiz:", error);
            } finally {
                setLoading(false);
            }
        }
        getsingleQuiz()
    }, [quiz_id])

    const fetchQuestion = async(questionId : string) => {
        try {
            const res = await fetch(`http://localhost:8000/question/${questionId}`, {
              method : 'GET',
                credentials : 'include'
            })
            const data = await res.json()
            setCurrentQuestion(data)
            setSelectedOption('')
        } catch (error) {
            console.error("Failed to load question:", error);
        }
    }

    const handleNext = async() => {
        if(currentQuestionIndex < quiz.question_ids.length - 1){
            setCurrentQuestionIndex(currentQuestionIndex+1)
        }
    }

    const handlePrevious = () => {
        if(currentQuestionIndex > 0){
            setCurrentQuestionIndex(currentQuestionIndex-1)
        }
    }

    useEffect(()=>{
        if(quiz.question_ids.length > 0){
            fetchQuestion(quiz.question_ids[currentQuestionIndex])
        }
    }, [quiz.question_ids, currentQuestionIndex]);

    if(loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-400 rounded-full animate-spin"></div>
            </div>
        )
    }

    const progress = quiz.question_ids.length > 0 ? ((currentQuestionIndex + 1) / quiz.question_ids.length) * 100 : 0;

    return(
        <div className="min-h-screen bg-black">
            {/* Background effects */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900 opacity-50"></div>
            <div className="fixed inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }}></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="bg-black/40 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <a href="/quiz" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-400 group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold">Back to Quizzes</span>
                            </a>
                        </div>
                        
                        <div className="mb-4">
                            <h1 className="text-3xl font-bold text-white mb-2">{quiz.title}</h1>
                            <p className="text-purple-300 text-sm">{quiz.description}</p>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-2">
                            <div className="flex items-center justify-between text-sm text-purple-300 mb-2">
                                <span>Question {currentQuestionIndex + 1} of {quiz.question_ids.length}</span>
                                <span>{Math.round(progress)}% Complete</span>
                            </div>
                            <div className="w-full bg-purple-950/30 rounded-full h-2">
                                <div 
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 md:p-12">
                        {/* Question */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Question {currentQuestionIndex + 1}</h2>
                            </div>
                            <p className="text-xl text-white mb-8">{currentQuestion.question_test}</p>
                        </div>

                        {/* Options */}
                        <div className="space-y-4 mb-8">
                            {currentQuestion?.options?.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedOption(opt)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                        selectedOption === opt
                                            ? 'bg-purple-600/20 border-purple-400 text-white'
                                            : 'bg-purple-950/30 border-purple-500/50 text-purple-300 hover:border-purple-400/70 hover:bg-purple-950/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                            selectedOption === opt
                                                ? 'border-purple-400 bg-purple-400'
                                                : 'border-purple-500/50'
                                        }`}>
                                            {selectedOption === opt && (
                                                <CheckCircle className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <span className="font-semibold">{opt}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between pt-6 border-t border-purple-500/30">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestionIndex === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-purple-950/30 border border-purple-500/50 rounded-xl text-purple-300 font-semibold hover:bg-purple-950/50 hover:border-purple-400/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Previous
                            </button>

                            {currentQuestionIndex < quiz.question_ids.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                                >
                                    Next
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                                >
                                    Submit Quiz
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
