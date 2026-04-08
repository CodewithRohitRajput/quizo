'use client'
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Trophy, RotateCcw } from 'lucide-react'
import AppNavbar from "@/components/AppNavbar";

type Quiz = {
    title: string;
    description: string;
    created_by: string;
    question_ids: string[];
    is_active: boolean;
    created_at: string;
};

type Question = {
    _id?: string;
    question_test: string;
    options: string[];
    correct_option: string;
    correct_answer?: string | number;
    answer?: string | number;
    correctOption?: string | number;
};

type StoredAttempt = {
    quizId: string;
    quizTitle: string;
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    completedAt: string;
};

type LocalAnswerKeyItem = {
    question_id?: string;
    question_test?: string;
    correct_option?: string;
    correct_option_index?: number;
};

export default function attemptQuiz(){
    const params = useParams();
    const router = useRouter();
    const quiz_id = String(params.id ?? "");
    const [quiz, setQuiz] = useState<Quiz>({
        title : '',
        description : '',
        created_by : '',
        question_ids : [],
        is_active : false,
        created_at : ''
    });
    const [questions, setQuestions] = useState<Question[]>([]);
    const[currentQuestionIndex , setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState({
        correct: 0,
        total: 0,
        percentage: 0
    });
    const [localAnswerKey, setLocalAnswerKey] = useState<LocalAnswerKeyItem[]>([]);

    const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase();

    const getPossibleCorrectValues = (question: Question): string[] => {
        const localMatch =
            localAnswerKey.find((item) => item.question_id && item.question_id === question._id) ||
            localAnswerKey.find((item) => normalize(item.question_test) === normalize(question.question_test));

        const dynamicRawValues = Object.entries(question as Record<string, unknown>)
            .filter(([key, value]) => {
                const k = key.toLowerCase();
                const isCandidateKey = k.includes("correct") || k === "answer";
                const isPrimitive = ["string", "number"].includes(typeof value);
                return isCandidateKey && isPrimitive;
            })
            .map(([, value]) => value as string | number);

        const rawValues = [
            question.correct_option,
            question.correct_answer,
            question.answer,
            question.correctOption,
            localMatch?.correct_option,
            localMatch?.correct_option_index,
            ...dynamicRawValues
        ];
        const normalizedOptionValues = question.options.map((opt) => normalize(opt));
        const possible = new Set<string>();

        rawValues.forEach((raw) => {
            const rawNormalized = normalize(raw);
            if (!rawNormalized) return;
            possible.add(rawNormalized);

            // numeric index support (0-based and 1-based)
            const parsedNum = Number(rawNormalized);
            if (!Number.isNaN(parsedNum)) {
                const zeroBased = Number.isInteger(parsedNum) ? parsedNum : -1;
                const oneBasedToZero = Number.isInteger(parsedNum) ? parsedNum - 1 : -1;

                if (zeroBased >= 0 && zeroBased < question.options.length) {
                    possible.add(normalize(question.options[zeroBased]));
                }
                if (oneBasedToZero >= 0 && oneBasedToZero < question.options.length) {
                    possible.add(normalize(question.options[oneBasedToZero]));
                }
            }

            // letter index support (A/B/C/D...)
            if (/^[a-z]$/i.test(rawNormalized)) {
                const charCode = rawNormalized.toUpperCase().charCodeAt(0) - 65;
                if (charCode >= 0 && charCode < question.options.length) {
                    possible.add(normalize(question.options[charCode]));
                }
            }

            // support values like option_1 / option 2 / opt3
            const extractedNumber = rawNormalized.match(/\d+/);
            if (extractedNumber) {
                const numeric = Number(extractedNumber[0]);
                const zeroBased = numeric;
                const oneBasedToZero = numeric - 1;

                if (zeroBased >= 0 && zeroBased < question.options.length) {
                    possible.add(normalize(question.options[zeroBased]));
                }
                if (oneBasedToZero >= 0 && oneBasedToZero < question.options.length) {
                    possible.add(normalize(question.options[oneBasedToZero]));
                }
            }
        });

        // Fallback: if backend sent option text with extra spaces/case, normalized set already handles.
        // Also include all direct normalized options only when a raw value exactly equals an index label.
        if (possible.has("a") || possible.has("b") || possible.has("c") || possible.has("d")) {
            normalizedOptionValues.forEach((opt) => possible.add(opt));
        }

        return Array.from(possible);
    };

    const isCorrectAnswer = (question: Question, selected: string | undefined) => {
        if (!selected) return false;
        const normalizedSelected = normalize(selected);
        const possibleCorrect = getPossibleCorrectValues(question);
        return possibleCorrect.includes(normalizedSelected);
    };

    useEffect(()=>{
        const getsingleQuiz = async () => {
            try {
                const res = await fetch(`http://localhost:8000/quiz/${quiz_id}`, {
                    method : "GET",
                    credentials : "include"
                })
                const data = await res.json();
                if(res.ok){
                    setQuiz(data);
                }
            } catch (error) {
                console.error("Failed to load quiz:", error);
            } finally {
                setLoading(false);
            }
        }
        getsingleQuiz();
    }, [quiz_id]);

    useEffect(() => {
        const fetchAllQuestions = async () => {
            if (quiz.question_ids.length === 0) return;
            try {
                const all = await Promise.all(
                    quiz.question_ids.map(async (questionId: string) => {
                        const res = await fetch(`http://localhost:8000/question/${questionId}`, {
                            method: 'GET',
                            credentials: 'include'
                        });
                        return res.json();
                    })
                );
                setQuestions(all);
            } catch (error) {
                console.error("Failed to load questions:", error);
            }
        };
        fetchAllQuestions();
    }, [quiz.question_ids]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(`quizo_answer_key_${quiz_id}`);
            const parsed: LocalAnswerKeyItem[] = raw ? JSON.parse(raw) : [];
            setLocalAnswerKey(parsed);
        } catch (error) {
            console.error("Failed to load local answer key:", error);
        }
    }, [quiz_id]);

    const handleNext = async() => {
        if(currentQuestionIndex < questions.length - 1){
            setCurrentQuestionIndex(currentQuestionIndex+1);
        }
    };

    const handlePrevious = () => {
        if(currentQuestionIndex > 0){
            setCurrentQuestionIndex(currentQuestionIndex-1);
        }
    };

    useEffect(() => {
        setSelectedOption(answers[currentQuestionIndex] ?? '');
    }, [currentQuestionIndex, answers]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleSelectOption = (option: string) => {
        setSelectedOption(option);
        setAnswers((prev) => ({
            ...prev,
            [currentQuestionIndex]: option
        }));
    };

    const saveAttemptToLocalStorage = (attempt: StoredAttempt) => {
        try {
            const key = "quizo_attempt_history";
            const previousRaw = localStorage.getItem(key);
            const previous: StoredAttempt[] = previousRaw ? JSON.parse(previousRaw) : [];
            const updated = [attempt, ...previous].slice(0, 30);
            localStorage.setItem(key, JSON.stringify(updated));
        } catch (error) {
            console.error("Failed to save attempt:", error);
        }
    };

    const handleSubmitQuiz = async () => {
        if (!currentQuestion || isSubmitting) return;
        setIsSubmitting(true);

        const total = questions.length;
        let correct = 0;
        questions.forEach((question, index) => {
            if (isCorrectAnswer(question, answers[index])) {
                correct += 1;
            }
        });

        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        setFinalScore({ correct, total, percentage });
        setIsSubmitted(true);

        saveAttemptToLocalStorage({
            quizId: quiz_id,
            quizTitle: quiz.title,
            totalQuestions: total,
            correctAnswers: correct,
            percentage,
            completedAt: new Date().toISOString()
        });

        setIsSubmitting(false);
    };

    const handleRetakeQuiz = () => {
        setCurrentQuestionIndex(0);
        setAnswers({});
        setSelectedOption('');
        setIsSubmitted(false);
        setFinalScore({ correct: 0, total: 0, percentage: 0 });
    };

    if(loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-400 rounded-full animate-spin"></div>
            </div>
        )
    }

    const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
    const answeredCount = Object.keys(answers).length;

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-black">
                <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900 opacity-50"></div>
                <AppNavbar />
                <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-8 md:p-12 text-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Quiz Completed</h1>
                        <p className="text-purple-300 mb-8">{quiz.title}</p>

                        <div className="grid md:grid-cols-3 gap-4 mb-10">
                            <div className="p-5 rounded-xl bg-purple-950/30 border border-purple-500/40">
                                <p className="text-purple-300 text-sm">Correct</p>
                                <p className="text-3xl font-bold text-white">{finalScore.correct}</p>
                            </div>
                            <div className="p-5 rounded-xl bg-purple-950/30 border border-purple-500/40">
                                <p className="text-purple-300 text-sm">Total</p>
                                <p className="text-3xl font-bold text-white">{finalScore.total}</p>
                            </div>
                            <div className="p-5 rounded-xl bg-purple-950/30 border border-purple-500/40">
                                <p className="text-purple-300 text-sm">Score</p>
                                <p className="text-3xl font-bold text-green-400">{finalScore.percentage}%</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={handleRetakeQuiz}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-purple-950/30 border border-purple-500/50 rounded-xl text-purple-300 font-semibold hover:bg-purple-950/50 hover:border-purple-400/70 transition-all"
                            >
                                <RotateCcw className="w-5 h-5" />
                                Retake Quiz
                            </button>
                            <button
                                onClick={() => router.push('/quiz')}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform"
                            >
                                Back to Quizzes
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
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

                {/* Header */}
                <div className="bg-black/40 backdrop-blur-lg border-b border-purple-500/30 sticky top-16 z-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <a href="/quiz" className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-400 group">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold">Back to Quizzes</span>
                            </a>
                        </div>
                        
                        <div className="mb-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{quiz.title}</h1>
                            <p className="text-purple-300 text-sm">{quiz.description}</p>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-2">
                            <div className="flex items-center justify-between text-sm text-purple-300 mb-2">
                                <span>Question {Math.min(currentQuestionIndex + 1, questions.length || 1)} of {questions.length}</span>
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-5 md:p-8 max-h-[calc(100vh-220px)] overflow-y-auto">
                        {questions.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-purple-300 text-lg">No questions available for this quiz yet.</p>
                            </div>
                        ) : (
                            <>
                        {/* Question */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Question {currentQuestionIndex + 1}</h2>
                            </div>
                            <p className="text-lg md:text-xl text-white mb-5">{currentQuestion?.question_test}</p>
                        </div>

                        {/* Options */}
                        <div className="space-y-3 mb-6">
                            {currentQuestion?.options?.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectOption(opt)}
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

                            {currentQuestionIndex < questions.length - 1 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={!selectedOption}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    Next
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitQuiz}
                                    disabled={answeredCount !== questions.length || isSubmitting}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-cyan-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <p className="mt-4 text-sm text-purple-300">
                            Answered {answeredCount} / {questions.length}
                        </p>
                        </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
