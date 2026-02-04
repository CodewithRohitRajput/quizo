'use client'
import { useEffect, useState } from "react"
import { User, Mail, Calendar, ArrowLeft, Settings, Edit } from 'lucide-react'
import { useRouter } from "next/navigation"

export default function Profile(){
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const getProfile = async () => {
            try {
                const data = await fetch("http://localhost:8000/profile", {credentials : 'include'})
                const response = await data.json()
                setProfile(response);
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setLoading(false);
            }
        }
        getProfile()
    }, [])

    if(loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-400 rounded-full animate-spin"></div>
            </div>
        )
    }

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
                        <div className="flex items-center justify-between">
                            <a href="/quiz" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-400 group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold">Back</span>
                            </a>
                            <button className="flex items-center gap-2 px-4 py-2 bg-purple-950/30 border border-purple-500/50 rounded-xl text-purple-300 font-semibold hover:bg-purple-950/50 transition-all">
                                <Edit className="w-4 h-4" />
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 md:p-12">
                        {/* Profile Header */}
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">{profile?.username || 'User'}</h1>
                            <p className="text-purple-300">Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                        </div>

                        {/* Profile Details */}
                        <div className="space-y-6">
                            <div className="p-6 bg-purple-950/30 border border-purple-500/50 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                                        <User className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Username</h3>
                                </div>
                                <p className="text-purple-300 ml-13">{profile?.username || 'Not set'}</p>
                            </div>

                            <div className="p-6 bg-purple-950/30 border border-purple-500/50 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Email</h3>
                                </div>
                                <p className="text-purple-300 ml-13">{profile?.email || 'Not set'}</p>
                            </div>

                            <div className="p-6 bg-purple-950/30 border border-purple-500/50 rounded-xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white">Account Created</h3>
                                </div>
                                <p className="text-purple-300 ml-13">
                                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    }) : 'Not available'}
                                </p>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="mt-8 pt-8 border-t border-purple-500/30">
                            <h2 className="text-xl font-bold text-white mb-6">Statistics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">0</div>
                                    <div className="text-purple-300 text-sm font-semibold">Quizzes Taken</div>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border border-cyan-500/50 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">0</div>
                                    <div className="text-purple-300 text-sm font-semibold">Quizzes Created</div>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-green-600/20 to-cyan-600/20 border border-green-500/50 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-2">0</div>
                                    <div className="text-purple-300 text-sm font-semibold">Average Score</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
