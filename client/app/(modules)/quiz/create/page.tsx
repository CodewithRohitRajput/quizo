'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Sparkles, FileText, AlignLeft, CheckCircle, AlertCircle, Zap, ArrowRight, Info, ToggleLeft, ToggleRight } from 'lucide-react'

export default function CreateQuiz(){
    const router = useRouter()
    const [form, setForm] = useState({
        title : '',
        description : '',
        is_active: false,
    })
    const [response, setResponse] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e : any)=>{
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const res = await fetch("http://localhost:8000/quiz/create", {
                method : "POST",
                headers : {
                    'Content-Type' : "application/json"
                },
                credentials : "include",
                body  : JSON.stringify(form)
            })
            const data = await res.json();
            console.log(data)
            if (data.quiz_id) {
                setResponse("Quiz created successfully! 🎉")
                setForm({
                    title : '',
                    description : '',
                    is_active : false
                })
                // Navigate to the quiz questions page
                setTimeout(() => {
                    router.push(`/quiz/create/${data.quiz_id}`)
                }, 1500);
            } else if (data.detail) {
                setResponse(data.detail)
            }
        } catch (error) {
            setResponse("something went wrong fr 😭")
        } finally {
            setIsLoading(false);
        }
    }

    const isSuccess = response.toLowerCase().includes('success') || response.includes('🎉');

    return(
        <div className="min-h-screen bg-black">
            {/* Background effects */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900 opacity-50"></div>
            <div className="fixed inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }}></div>

            {/* Floating emojis */}
            {['✨', '🎯', '💡', '🚀', '⚡', '🔥'].map((emoji, i) => (
                <div
                    key={i}
                    className="fixed text-4xl animate-float opacity-10 pointer-events-none"
                    style={{
                        left: `${(i * 15 + 5)}%`,
                        top: `${(i * 12 + 10)}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + i * 0.3}s`
                    }}
                >
                    {emoji}
                </div>
            ))}

            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    {/* Back link */}
                    <a href="/quiz" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-400 mb-6 group">
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold">back to quizzes</span>
                    </a>

                    {/* Main Card */}
                    <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 md:p-12 shadow-2xl">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                                    style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                                    CREATE YOUR QUIZ
                                </h1>
                                <Sparkles className="w-8 h-8 text-yellow-400 animate-spin-slow" />
                            </div>
                            <p className="text-purple-300 font-semibold text-lg">
                                time to flex ur creativity and make something legendary 🎨
                            </p>
                        </div>

                        {/* Info Banner */}
                        <div className="flex items-start gap-3 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mb-8">
                            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-cyan-300 text-sm font-semibold">
                                    <span className="font-black">PRO TIP:</span> Make ur quiz title catchy and description clear so people actually wanna take it frfr
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title field */}
                            <div className="space-y-2">
                                <label className="text-purple-300 font-bold text-sm flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    QUIZ TITLE
                                </label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Ultimate Gen Z Pop Culture Quiz"
                                    value={form.title} 
                                    onChange={(e)=>setForm({...form, title : e.target.value})}
                                    className="w-full px-4 py-4 bg-purple-950/30 border border-purple-500/50 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-lg"
                                    required
                                />
                                <p className="text-purple-400 text-xs">make it catchy and unforgettable</p>
                            </div>

                            {/* Description field */}
                            <div className="space-y-2">
                                <label className="text-purple-300 font-bold text-sm flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4" />
                                    QUIZ DESCRIPTION
                                </label>
                                <textarea
                                    placeholder="e.g., Test ur knowledge on the hottest trends, memes, and pop culture moments. Only real ones will ace this 💯"
                                    value={form.description} 
                                    onChange={(e)=>setForm({...form, description : e.target.value})}
                                    className="w-full px-4 py-4 bg-purple-950/30 border border-purple-500/50 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all text-lg resize-none"
                                    rows={4}
                                    required
                                />
                                <p className="text-purple-400 text-xs">tell people what ur quiz is about</p>
                            </div>

                            {/* Active toggle */}
                            <div className="space-y-2">
                                <label className="text-purple-300 font-bold text-sm flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    QUIZ STATUS
                                </label>
                                <div 
                                    onClick={() => setForm({...form, is_active: !form.is_active})}
                                    className={`flex items-center justify-between p-5 rounded-xl border-2 cursor-pointer transition-all ${
                                        form.is_active 
                                            ? 'bg-green-500/10 border-green-500/50 hover:bg-green-500/20' 
                                            : 'bg-purple-950/30 border-purple-500/50 hover:bg-purple-950/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {form.is_active ? (
                                            <CheckCircle className="w-6 h-6 text-green-400" />
                                        ) : (
                                            <AlertCircle className="w-6 h-6 text-purple-400" />
                                        )}
                                        <div>
                                            <div className={`font-black text-lg ${form.is_active ? 'text-green-400' : 'text-purple-300'}`}>
                                                {form.is_active ? 'ACTIVE' : 'INACTIVE'}
                                            </div>
                                            <div className="text-sm text-purple-400">
                                                {form.is_active 
                                                    ? 'quiz is live and ready to go 🚀' 
                                                    : 'quiz is hidden from everyone'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`p-1 rounded-full transition-all ${
                                        form.is_active ? 'bg-green-500' : 'bg-purple-600/50'
                                    }`}>
                                        {form.is_active ? (
                                            <ToggleRight className="w-10 h-10 text-white" />
                                        ) : (
                                            <ToggleLeft className="w-10 h-10 text-white" />
                                        )}
                                    </div>
                                </div>
                                <p className="text-purple-400 text-xs">
                                    {form.is_active 
                                        ? '✅ people can see and take ur quiz' 
                                        : '🔒 only u can see it (activate when ur ready)'}
                                </p>
                            </div>

                            {/* Response message */}
                            {response && (
                                <div className={`flex items-center gap-2 p-4 rounded-xl border ${
                                    isSuccess 
                                        ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                                        : 'bg-red-500/10 border-red-500/50 text-red-400'
                                } animate-fade-in`}>
                                    {isSuccess ? (
                                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    )}
                                    <span className="font-semibold">{response}</span>
                                </div>
                            )}

                            {/* Submit button */}
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className="w-full group relative px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-black text-xl text-white overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            <span>CREATING...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>CREATE QUIZ</span>
                                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        {/* Additional Info */}
                        <div className="mt-8 pt-8 border-t border-purple-500/30">
                            <div className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                                <div>
                                    <p className="text-purple-300 text-sm font-semibold mb-2">
                                        <span className="text-purple-200 font-black">WHAT HAPPENS NEXT?</span>
                                    </p>
                                    <p className="text-purple-400 text-sm">
                                        After creating ur quiz, you'll add questions and answers. Then ur quiz will be ready for the world to see! 🌎
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom badge */}
                    <div className="mt-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-purple-300 font-bold text-sm">ur about to create something legendary</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom animations */}
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
                
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(180deg);
                    }
                }

                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}