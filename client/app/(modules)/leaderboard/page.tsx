'use client';

import { useEffect, useMemo, useState } from "react";
import { Medal, Trophy, Star, TrendingUp } from "lucide-react";
import AppNavbar from "@/components/AppNavbar";

type Attempt = {
    quizId: string;
    quizTitle: string;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    completedAt: string;
};

type RankedAttempt = Attempt & { rank: number };

export default function LeaderboardPage() {
    const [attempts, setAttempts] = useState<Attempt[]>([]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem("quizo_attempt_history");
            const parsed: Attempt[] = raw ? JSON.parse(raw) : [];
            setAttempts(Array.isArray(parsed) ? parsed : []);
        } catch (error) {
            console.error("Failed to load leaderboard data:", error);
            setAttempts([]);
        }
    }, []);

    const rankedAttempts = useMemo<RankedAttempt[]>(() => {
        return [...attempts]
            .sort((a, b) => {
                if (b.percentage !== a.percentage) return b.percentage - a.percentage;
                if (b.correctAnswers !== a.correctAnswers) return b.correctAnswers - a.correctAnswers;
                return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
            })
            .map((attempt, index) => ({ ...attempt, rank: index + 1 }));
    }, [attempts]);

    const quizWiseRanking = useMemo(() => {
        const grouped = new Map<string, Attempt[]>();
        attempts.forEach((attempt) => {
            const key = `${attempt.quizId}__${attempt.quizTitle}`;
            const list = grouped.get(key) ?? [];
            list.push(attempt);
            grouped.set(key, list);
        });

        return Array.from(grouped.entries())
            .map(([key, list]) => {
                const [, title] = key.split("__");
                const best = [...list].sort((a, b) => b.percentage - a.percentage)[0];
                const avg = Math.round(list.reduce((acc, item) => acc + item.percentage, 0) / list.length);
                return {
                    title,
                    attempts: list.length,
                    bestScore: best?.percentage ?? 0,
                    averageScore: avg
                };
            })
            .sort((a, b) => b.bestScore - a.bestScore);
    }, [attempts]);

    const topScore = rankedAttempts[0]?.percentage ?? 0;

    return (
        <div className="min-h-screen bg-black">
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900 opacity-50"></div>
            <div className="fixed inset-0 opacity-10" style={{
                backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }}></div>

            <div className="relative z-10">
                <AppNavbar />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400">
                            LEADERBOARD
                        </h1>
                        <p className="text-purple-300 mt-2">Track your best quiz performances and progress.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <div className="p-5 rounded-xl bg-black/40 border border-purple-500/40">
                            <p className="text-purple-300 text-sm">Total Attempts</p>
                            <p className="text-3xl font-bold text-white">{attempts.length}</p>
                        </div>
                        <div className="p-5 rounded-xl bg-black/40 border border-purple-500/40">
                            <p className="text-purple-300 text-sm">Top Score</p>
                            <p className="text-3xl font-bold text-green-400">{topScore}%</p>
                        </div>
                        <div className="p-5 rounded-xl bg-black/40 border border-purple-500/40">
                            <p className="text-purple-300 text-sm">Quizzes Played</p>
                            <p className="text-3xl font-bold text-cyan-400">{quizWiseRanking.length}</p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                <h2 className="text-2xl font-bold text-white">Top Attempts</h2>
                            </div>
                            {rankedAttempts.length === 0 ? (
                                <p className="text-purple-300">No attempts yet. Start a quiz to appear on the leaderboard.</p>
                            ) : (
                                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                                    {rankedAttempts.map((item) => (
                                        <div key={`${item.quizId}-${item.completedAt}-${item.rank}`} className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                                                    {item.rank <= 3 ? <Medal className="w-4 h-4" /> : item.rank}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white font-semibold truncate">{item.quizTitle}</p>
                                                    <p className="text-purple-300 text-sm">{item.correctAnswers}/{item.totalQuestions} correct</p>
                                                </div>
                                            </div>
                                            <p className="text-green-400 font-bold text-lg">{item.percentage}%</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <TrendingUp className="w-5 h-5 text-cyan-400" />
                                <h2 className="text-2xl font-bold text-white">Quiz Rankings</h2>
                            </div>
                            {quizWiseRanking.length === 0 ? (
                                <p className="text-purple-300">No quiz stats available yet.</p>
                            ) : (
                                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                                    {quizWiseRanking.map((item, index) => (
                                        <div key={`${item.title}-${index}`} className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20">
                                            <div className="flex items-center justify-between gap-3 mb-2">
                                                <p className="text-white font-semibold">{item.title}</p>
                                                <span className="text-yellow-300 text-sm font-bold flex items-center gap-1">
                                                    <Star className="w-4 h-4" />
                                                    Best {item.bestScore}%
                                                </span>
                                            </div>
                                            <p className="text-purple-300 text-sm">
                                                Attempts: {item.attempts} • Average: {item.averageScore}%
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
