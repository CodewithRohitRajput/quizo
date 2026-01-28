'use client'

import { useState } from "react"
import { Sparkles, Mail, Lock, User, ArrowRight, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function Signup(){
    const[form, setForm] = useState({
        username : "",
        email : "",
        password : ""
    })
    const[responses , setResponse] = useState<string>("")
    const[showPassword, setShowPassword] = useState(false)
    const[isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSignup = async (e : any) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const res = await fetch(`http://localhost:8000/auth/signup`, {
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
            router.push('/quiz')
        } catch (error) {
            setResponse("something went wrong fr 😭")
        } finally {
            setIsLoading(false);
        }
    }

    const isSuccess = responses.toLowerCase().includes('success') || responses.toLowerCase().includes('created');

    return(
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900 opacity-50"></div>
            
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }}></div>

            {/* Floating emojis */}
            {/* {['🚀', '⚡', '✨', '💫', '🎯', '💜'].map((emoji, i) => (
                <div
                    key={i}
                    className="absolute text-4xl animate-float opacity-20"
                    style={{
                        left: `${(i * 15 + 5)}%`,
                        top: `${(i * 12 + 10)}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: `${3 + i * 0.3}s`
                    }}
                >
                    {emoji}
                </div>
            ))} */}

            {/* Main signup card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Back link */}
                <a href="/" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-400 mb-6 group">
                    <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-semibold">back to home</span>
                </a>

                {/* Card */}
                <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 shadow-2xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                                style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                                SIGN UP
                            </h1>
                            <Sparkles className="w-6 h-6 text-yellow-400 animate-spin-slow" />
                        </div>
                        <p className="text-purple-300 font-semibold text-lg">
                            join the big brain squad rn 🧠
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignup} className="space-y-5">
                        {/* Username field */}
                        <div className="space-y-2">
                            <label className="text-purple-300 font-bold text-sm flex items-center gap-2">
                                <User className="w-4 h-4" />
                                USERNAME
                            </label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="ur epic username"
                                    value={form.username} 
                                    onChange={(e)=>setForm({...form, username :e.target.value})}
                                    className="w-full px-4 py-3 bg-purple-950/30 border border-purple-500/50 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email field */}
                        <div className="space-y-2">
                            <label className="text-purple-300 font-bold text-sm flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                EMAIL
                            </label>
                            <div className="relative">
                                <input 
                                    type="email" 
                                    placeholder="ur.email@example.com"
                                    value={form.email} 
                                    onChange={(e)=>setForm({...form, email :e.target.value})}
                                    className="w-full px-4 py-3 bg-purple-950/30 border border-purple-500/50 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="space-y-2">
                            <label className="text-purple-300 font-bold text-sm flex items-center gap-2">
                                <Lock className="w-4 h-4" />
                                PASSWORD
                            </label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="make it strong frfr"
                                    value={form.password} 
                                    onChange={(e)=>setForm({...form, password :e.target.value})}
                                    className="w-full px-4 py-3 pr-12 bg-purple-950/30 border border-purple-500/50 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Response message */}
                        {responses && (
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
                                <span className="font-semibold">{responses}</span>
                            </div>
                        )}

                        {/* Submit button */}
                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full group relative px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-black text-lg text-white overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>CREATING...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>CREATE ACCOUNT</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-purple-500/30"></div>
                        <span className="text-purple-400 text-sm font-semibold">or</span>
                        <div className="flex-1 h-px bg-purple-500/30"></div>
                    </div>

                    {/* Social login */}
                    <div className="space-y-3">
                        <button className="w-full px-6 py-3 bg-purple-950/30 border border-purple-500/50 rounded-xl text-purple-300 font-bold hover:bg-purple-950/50 hover:border-purple-400/70 transition-all flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            continue with google
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-purple-400 text-sm">
                            already got an account?{' '}
                            <a href="/login" className="text-purple-300 font-bold hover:text-purple-200 transition-colors">
                                log in here
                            </a>
                        </p>
                    </div>

                    {/* Terms */}
                    <p className="mt-6 text-purple-500 text-xs text-center">
                        by signing up u agree to our{' '}
                        <a href="/terms" className="underline hover:text-purple-400">terms</a>
                        {' '}and{' '}
                        <a href="/privacy" className="underline hover:text-purple-400">privacy policy</a>
                    </p>
                </div>

                {/* Extra message */}
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span className="text-purple-300 font-bold text-sm">join 5000+ big brain legends</span>
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