'use client'
import { useEffect, useState } from "react"
import { User, Mail, Calendar } from 'lucide-react'
import AppNavbar from "@/components/AppNavbar";

type Attempt = {
    quizId: string;
    quizTitle: string;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    completedAt: string;
};

export default function Profile(){
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [attempts, setAttempts] = useState<Attempt[]>([])
    const [createdCount, setCreatedCount] = useState(0)
    const [fallbackCreatedDate, setFallbackCreatedDate] = useState<Date | null>(null)

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

    useEffect(() => {
        try {
            const raw = localStorage.getItem("quizo_attempt_history");
            const parsed: Attempt[] = raw ? JSON.parse(raw) : [];
            setAttempts(parsed);
        } catch (error) {
            console.error("Failed to load attempts:", error);
        }
    }, []);

    useEffect(() => {
        const getCreatedCount = async () => {
            if (!profile) return;
            try {
                const res = await fetch("http://localhost:8000/quiz", { credentials: "include" });
                const data = await res.json();
                const list = Array.isArray(data) ? data : [];

                const username = String(profile?.username ?? "").toLowerCase().trim();
                const email = String(profile?.email ?? "").toLowerCase().trim();

                const mine = list.filter((q: any) => {
                    const creator = String(q?.created_by ?? q?.createdBy ?? "").toLowerCase().trim();
                    return Boolean(creator) && (creator === username || creator === email);
                });
                setCreatedCount(mine.length);

                const possibleDates: Date[] = mine
                    .map((q: any) => new Date(q?.created_at ?? q?.createdAt ?? q?.updated_at ?? q?.updatedAt))
                    .filter((d: Date) => !Number.isNaN(d.getTime()));
                if (possibleDates.length > 0) {
                    const earliest = new Date(Math.min(...possibleDates.map((d) => d.getTime())));
                    setFallbackCreatedDate(earliest);
                }
            } catch (error) {
                console.error("Failed to load created quiz count:", error);
            }
        };
        getCreatedCount();
    }, [profile]);

    const quizzesTaken = attempts.length;
    const averageScore = quizzesTaken > 0
        ? Math.round(attempts.reduce((acc, item) => acc + item.percentage, 0) / quizzesTaken)
        : 0;
    const totalCorrect = attempts.reduce((acc, item) => acc + item.correctAnswers, 0);
    const totalQuestionsAnswered = attempts.reduce((acc, item) => acc + item.totalQuestions, 0);

    const getProfileCreatedDate = () => {
        const candidates = [
            profile?.created_at,
            profile?.createdAt,
            profile?.joined_at,
            profile?.joinedAt,
            profile?.date_joined,
            profile?.dateJoined
        ];

        for (const value of candidates) {
            if (!value) continue;
            const parsed = new Date(value);
            if (!Number.isNaN(parsed.getTime())) {
                return parsed;
            }
        }
        return null;
    };

    const createdDate = getProfileCreatedDate() ?? fallbackCreatedDate;

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
                <AppNavbar />

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 md:p-12">
                        {/* Profile Header */}
                        <div className="text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                                <User className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">{profile?.username || 'User'}</h1>
                            <p className="text-purple-300">Member since {createdDate ? createdDate.toLocaleDateString() : 'N/A'}</p>
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
                                    {createdDate ? createdDate.toLocaleDateString('en-US', { 
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
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="p-6 bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">{quizzesTaken}</div>
                                    <div className="text-purple-300 text-sm font-semibold">Quizzes Taken</div>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border border-cyan-500/50 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">{createdCount}</div>
                                    <div className="text-purple-300 text-sm font-semibold">Quizzes Created</div>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-green-600/20 to-cyan-600/20 border border-green-500/50 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-2">{averageScore}%</div>
                                    <div className="text-purple-300 text-sm font-semibold">Average Score</div>
                                </div>
                                <div className="p-6 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/50 rounded-xl text-center">
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">{totalCorrect}/{totalQuestionsAnswered}</div>
                                    <div className="text-purple-300 text-sm font-semibold">Total Correct</div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-purple-500/30">
                            <h2 className="text-xl font-bold text-white mb-6">All Quiz Scores</h2>
                            {attempts.length === 0 ? (
                                <div className="p-6 bg-purple-950/30 border border-purple-500/50 rounded-xl">
                                    <p className="text-purple-300">No attempts yet. Take a quiz to see your history.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {attempts.map((attempt, index) => (
                                        <div key={`${attempt.quizId}-${attempt.completedAt}-${index}`} className="p-4 bg-purple-950/30 border border-purple-500/40 rounded-xl flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-white font-semibold">{attempt.quizTitle}</p>
                                                <p className="text-purple-300 text-sm">
                                                    {new Date(attempt.completedAt).toLocaleDateString()} - {attempt.correctAnswers}/{attempt.totalQuestions} correct
                                                </p>
                                            </div>
                                            <p className="text-green-400 font-bold text-lg">{attempt.percentage}%</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
