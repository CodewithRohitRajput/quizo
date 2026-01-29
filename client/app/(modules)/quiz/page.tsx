'use client'

import { useEffect, useState } from "react"
import { Sparkles, Clock, User, Play, Trophy, TrendingUp, Zap, CheckCircle, XCircle, Search, Filter } from 'lucide-react'
import { useRouter } from "next/navigation";

export default function Quiz(){
    const[quiz,setQuiz] = useState<any[]>([]);
    const[loading, setLoading] = useState(true);
    const[searchTerm, setSearchTerm] = useState("");
    const[filterActive, setFilterActive] = useState<boolean | null>(null);
    const router = useRouter()
    useEffect(()=>{
        const getQuiz = async () => {
            try {
                const response = await fetch('http://localhost:8000/quiz', {
                    method : "GET",
                    credentials : "include"
                })
                const data = await response.json();
                setQuiz(data)
            } catch (error) {
                console.error("Failed to load quizzes:", error);
            } finally {
                setLoading(false);
            }
        }
        getQuiz();
    }, [])

    // Filter quizzes based on search and active status
    const filteredQuizzes = quiz.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (typeof q.created_by === 'string' && q.created_by.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesFilter = filterActive === null || q.is_active === filterActive;
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return(
        <div className="min-h-screen bg-black">
            {/* Background effects */}
            {/* <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900 opacity-50"></div>
            <div className="fixed inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }}></div> */}

            {/* Floating emojis
            {['🎯', '🧠', '⚡', '✨', '🔥', '💯'].map((emoji, i) => (
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
            ))} */}

            <div className="relative z-10">
                {/* Header */}
                <div className="bg-black/40 backdrop-blur-lg border-b border-purple-500/30 sticky top-0 z-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <a href="/" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-400 mb-3 group">
                                    <span className="text-2xl">←</span>
                                    <span className="font-semibold">back</span>
                                </a>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                                        style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                                        EXPLORE QUIZZES
                                    </h1>
                                    <Sparkles className="w-8 h-8 text-yellow-400 animate-spin-slow" />
                                </div>
                                <p className="text-purple-300 font-semibold text-lg mt-2">
                                    find ur next challenge and flex that brain power 🧠
                                </p>
                            </div>
                        </div>

                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                                <input
                                    type="text"
                                    placeholder="search for quizzes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-purple-950/30 border border-purple-500/50 rounded-xl text-white placeholder-purple-400/50 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
                                />
                            </div>

                            {/* Filter */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilterActive(null)}
                                    className={`px-4 py-3 rounded-xl font-bold transition-all ${
                                        filterActive === null
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-purple-950/30 border border-purple-500/50 text-purple-300 hover:bg-purple-950/50'
                                    }`}
                                >
                                    all
                                </button>
                                <button
                                    onClick={() => setFilterActive(true)}
                                    className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                                        filterActive === true
                                            ? 'bg-green-600 text-white'
                                            : 'bg-purple-950/30 border border-purple-500/50 text-purple-300 hover:bg-purple-950/50'
                                    }`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    active
                                </button>
                                <button
                                    onClick={() => setFilterActive(false)}
                                    className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                                        filterActive === false
                                            ? 'bg-red-600 text-white'
                                            : 'bg-purple-950/30 border border-purple-500/50 text-purple-300 hover:bg-purple-950/50'
                                    }`}
                                >
                                    <XCircle className="w-4 h-4" />
                                    inactive
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4 mt-4">
                            <div className="px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full">
                                <span className="text-purple-300 font-bold text-sm">
                                    {filteredQuizzes.length} quiz found
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {loading ? (
                        // Loading state
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-400 rounded-full animate-spin mb-4"></div>
                            <p className="text-purple-300 text-xl font-semibold">loading quizzes...</p>
                        </div>
                    ) : filteredQuizzes.length === 0 ? (
                        // Empty state
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="text-6xl mb-4">😔</div>
                            <h3 className="text-3xl font-black text-white mb-2">no quizzes found</h3>
                            <p className="text-purple-300 text-lg">try adjusting ur search or filters</p>
                        </div>
                    ) : (
                        // Quiz Grid
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredQuizzes.map((q, idx) => (
                                <div
                                    key={idx}
                                    className="group relative bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 hover:border-purple-400/60 hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden"
                                >
                                    {/* Gradient overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                                    {/* Status badge */}
                                    <div className="absolute top-4 right-4">
                                        {q.is_active ? (
                                            <div className="flex items-center gap-1 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded-full">
                                                <CheckCircle className="w-3 h-3 text-green-400" />
                                                <span className="text-green-400 text-xs font-bold">active</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                                                <XCircle className="w-3 h-3 text-red-400" />
                                                <span className="text-red-400 text-xs font-bold">inactive</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10">
                                        {/* Icon */}
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform">
                                            <Trophy className="w-6 h-6 text-white" />
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-all"
                                            style={{ fontFamily: '"Space Mono", monospace' }}>
                                            {q.title}
                                        </h2>

                                        {/* Description */}
                                        <p className="text-purple-300 mb-4 line-clamp-2">
                                            {q.description}
                                        </p>

                                        {/* Meta info */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-purple-400">
                                                <User className="w-4 h-4" />
                                                <span>by {q.created_by}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-purple-400">
                                                <Clock className="w-4 h-4" />
                                                <span>{formatDate(q.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Action button */}
                                        <button
                                            disabled={!q.is_active}
                                            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-white transition-all ${
                                                q.is_active
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/50'
                                                    : 'bg-gray-600/30 cursor-not-allowed opacity-50'
                                            }`}
                                        >
                                            {q.is_active ? (
                                                <>
                                                    <Play className="w-5 h-5" />
                                                    <span>ATTEMPT NOW</span>
                                                    <Zap className="w-5 h-5" />
                                                </>
                                            ) : (
                                                <span>UNAVAILABLE</span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom CTA */}
                {!loading && filteredQuizzes.length > 0 && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 backdrop-blur-lg rounded-3xl p-8 text-center">
                            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-3"
                                style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
                                CAN'T FIND WHAT U LOOKING FOR?
                            </h3>
                            <p className="text-purple-300 text-lg mb-6 font-semibold">
                                create ur own quiz and challenge the community 🔥
                            </p>
                            <button onClick={()=>{router.push("/quiz/create")}} className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full font-black text-xl text-white hover:scale-105 transition-transform shadow-xl">
                                CREATE QUIZ
                            </button>
                        </div>
                    </div>
                )}
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

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-spin-slow {
                    animation: spin-slow 3s linear infinite;
                }

                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    )
}