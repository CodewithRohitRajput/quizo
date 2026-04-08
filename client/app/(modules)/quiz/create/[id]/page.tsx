'use client'
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, FileText, CheckCircle, ArrowRight } from 'lucide-react'
import AppNavbar from "@/components/AppNavbar";

export default function createQuestions(){
    const params = useParams()
    const router = useRouter()
    const[questions, setQuestions] = useState([{
        question_test : '',
        options : ['', '', '', ''],
        correct_option : '',
        correct_option_index: -1
    }])
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<string>('')
    const quiz_id = params.id

    useEffect(()=>{
        const fetchQuizName = async () =>{
            try {
                const res = await fetch(`http://localhost:8000/quiz/${quiz_id}`, {
                    method : "GET",
                    credentials : "include"
                })
                const data = await res.json();
                setName(data.title)
            } catch (error) {
                console.error("Failed to load quiz:", error);
            }
        }
        fetchQuizName();
    }, [quiz_id])

    const handleSubmit = async (e : any) =>{
      e.preventDefault();
      setLoading(true);
      setResponse('');
      
      try {
          const questionsWithQuizId = questions.map((q) => ({
              quiz_id,
              // keep both spellings because backend schema may vary
              question_test: q.question_test,
              question_text: q.question_test,
              options: q.options,
              // keep both text and index for correct answer
              correct_option: q.correct_option,
              correct_answer: q.correct_option,
              answer: q.correct_option,
              correct_option_index: q.correct_option_index
          }));
          
          const res = await fetch(`http://localhost:8000/question`, {
            method : "POST",
            headers : {
              "Content-Type" : "application/json"
            },
            credentials : "include",
            body : JSON.stringify(questionsWithQuizId)
          })
          
          const data = await res.json();
          
          if (data.ids) {
              try {
                  const answerKey = data.ids.map((id: string, idx: number) => ({
                      question_id: id,
                      question_test: questions[idx]?.question_test ?? "",
                      correct_option: questions[idx]?.correct_option ?? "",
                      correct_option_index: questions[idx]?.correct_option_index ?? -1
                  }));
                  localStorage.setItem(`quizo_answer_key_${quiz_id}`, JSON.stringify(answerKey));
              } catch (error) {
                  console.error("Failed to save answer key locally:", error);
              }

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
              
              if (update.ok) {
                  setResponse("Questions created successfully!")
                  setTimeout(() => {
                      router.push('/quiz')
                  }, 1500);
              }
          }
      } catch (error) {
          setResponse("Failed to create questions. Please try again.")
      } finally {
          setLoading(false);
      }
    }

    const addQuestion = () => {
        setQuestions([...questions, {
            question_test : '',
            options : ['', '', '', ''],
            correct_option : '',
            correct_option_index: -1
        }])
    }

    const removeQuestion = (index: number) => {
        if (questions.length > 1) {
            setQuestions(questions.filter((_, i) => i !== index))
        }
    }

    const updateQuestion = (index: number, field: string, value: any) => {
        const updated = [...questions];
        if (field === 'question_test') {
            updated[index].question_test = value;
        } else if (field.startsWith('option_')) {
            const optIndex = parseInt(field.split('_')[1]);
            updated[index].options[optIndex] = value;
        } else if (field === 'correct_option') {
            updated[index].correct_option = value;
        } else if (field === 'correct_option_index') {
            updated[index].correct_option_index = value;
        }
        setQuestions(updated);
    }

    return(
        <div className="min-h-screen bg-black">
            <AppNavbar />
            {/* Background effects */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900 opacity-50"></div>
            <div className="fixed inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }}></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="bg-black/40 backdrop-blur-lg border-b border-purple-500/30 sticky top-16 z-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between mb-4">
                            <a href="/quiz/create" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-400 group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold">Back</span>
                            </a>
                        </div>
                        <h1 className="text-3xl font-bold text-white">Create Questions</h1>
                        <p className="text-purple-300 mt-2">Quiz: {name}</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {questions.map((q, idx) => (
                            <div key={idx} className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 md:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white">Question {idx + 1}</h3>
                                    </div>
                                    {questions.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(idx)}
                                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-purple-300 font-semibold text-sm mb-2 block">Question Text</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your question"
                                            value={q.question_test}
                                            onChange={e => updateQuestion(idx, 'question_test', e.target.value)}
                                            className="w-full px-4 py-3 bg-purple-950/30 border border-purple-500/50 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-purple-300 font-semibold text-sm mb-2 block">Options</label>
                                        <div className="space-y-3">
                                            {q.options.map((opt, optIdx) => (
                                                <input
                                                    key={optIdx}
                                                    type="text"
                                                    placeholder={`Option ${optIdx + 1}`}
                                                    value={opt}
                                                    onChange={e => updateQuestion(idx, `option_${optIdx}`, e.target.value)}
                                                    className="w-full px-4 py-3 bg-purple-950/30 border border-purple-500/50 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                                                    required
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-purple-300 font-semibold text-sm mb-2 block">Correct Answer</label>
                                        <select
                                            value={q.correct_option_index >= 0 ? String(q.correct_option_index) : ''}
                                            onChange={e => {
                                                const selectedIdx = Number(e.target.value);
                                                updateQuestion(idx, 'correct_option_index', selectedIdx);
                                                updateQuestion(idx, 'correct_option', q.options[selectedIdx] ?? '');
                                            }}
                                            className="w-full px-4 py-3 bg-purple-950/30 border border-purple-500/50 rounded-xl text-white focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                                            required
                                        >
                                            <option value="">Select correct option</option>
                                            {q.options.map((opt, optIdx) => (
                                                opt && (
                                                    <option key={optIdx} value={String(optIdx)}>
                                                        {opt}
                                                    </option>
                                                )
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {response && (
                            <div className={`flex items-center gap-2 p-4 rounded-xl border ${
                                response.includes('successfully')
                                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                            }`}>
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                <span className="font-semibold">{response}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-6 border-t border-purple-500/30">
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="flex items-center gap-2 px-6 py-3 bg-purple-950/30 border border-purple-500/50 rounded-xl text-purple-300 font-semibold hover:bg-purple-950/50 hover:border-purple-400/70 transition-all"
                            >
                                <Plus className="w-5 h-5" />
                                Add Question
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit Questions</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
