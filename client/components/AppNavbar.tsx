'use client';

import { useRouter } from "next/navigation";
import { BookOpen, Home, PlusCircle, Trophy, UserCircle2 } from "lucide-react";

export default function AppNavbar() {
    const router = useRouter();

    return (
        <div className="sticky top-0 z-40 border-b border-purple-500/30 bg-black/70 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <button
                    onClick={() => router.push('/')}
                    className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400"
                >
                    QUIZO
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                    <button onClick={() => router.push('/')} className="px-3 py-2 rounded-lg text-purple-200 hover:bg-purple-900/40 flex items-center gap-2">
                        <Home className="w-4 h-4" />
                        <span className="hidden sm:inline">Home</span>
                    </button>
                    <button onClick={() => router.push('/quiz')} className="px-3 py-2 rounded-lg text-purple-200 hover:bg-purple-900/40 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="hidden sm:inline">Quizzes</span>
                    </button>
                    <button onClick={() => router.push('/quiz/create')} className="px-3 py-2 rounded-lg text-purple-200 hover:bg-purple-900/40 flex items-center gap-2">
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Create</span>
                    </button>
                    <button onClick={() => router.push('/leaderboard')} className="px-3 py-2 rounded-lg text-purple-200 hover:bg-purple-900/40 flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        <span className="hidden sm:inline">Leaderboard</span>
                    </button>
                    <button onClick={() => router.push('/profile')} className="px-3 py-2 rounded-lg text-purple-200 hover:bg-purple-900/40 flex items-center gap-2">
                        <UserCircle2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Profile</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
