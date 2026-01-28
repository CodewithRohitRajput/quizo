'use client'
import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Trophy, Brain, ArrowRight, Star, Users, TrendingUp, Award, CheckCircle, Instagram, Twitter, Youtube, Github, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const floatingEmojis = ['🔥', '💯', '⚡', '✨', '🚀', '💪', '🎯', '👑'];
  
  const categories = [
    { name: 'Science', emoji: '🧬', color: 'from-green-400 to-cyan-400' },
    { name: 'Pop Culture', emoji: '🎬', color: 'from-pink-400 to-purple-400' },
    { name: 'History', emoji: '📜', color: 'from-yellow-400 to-orange-400' },
    { name: 'Sports', emoji: '⚽', color: 'from-blue-400 to-cyan-400' },
    { name: 'Music', emoji: '🎵', color: 'from-purple-400 to-pink-400' },
    { name: 'Gaming', emoji: '🎮', color: 'from-red-400 to-pink-400' },
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'lightning rounds',
      desc: 'quick fire questions that keep u on ur toes fr fr',
      color: 'yellow'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'flex zone',
      desc: 'show off ur scores and become the ultimate quiz lord',
      color: 'pink'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'squad battles',
      desc: 'challenge ur homies and see who\'s really big brain',
      color: 'cyan'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'level up system',
      desc: 'unlock badges, titles, and bragging rights as u go',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                QUIZO
              </div>
              <Sparkles className="w-5 h-5 text-yellow-400 animate-spin-slow" />
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-purple-300 hover:text-purple-400 font-semibold transition-colors">features</a>
              <a href="#categories" className="text-purple-300 hover:text-purple-400 font-semibold transition-colors">categories</a>
              <a href="#leaderboard" className="text-purple-300 hover:text-purple-400 font-semibold transition-colors">leaderboard</a>
              <button onClick={()=>router.push('/signup')} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white hover:scale-105 transition-transform">
                sign up
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-purple-400" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-black/95 border-t border-purple-500/30 animate-fade-in">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-purple-300 hover:text-purple-400 font-semibold">features</a>
              <a href="#categories" className="block text-purple-300 hover:text-purple-400 font-semibold">categories</a>
              <a href="#leaderboard" className="block text-purple-300 hover:text-purple-400 font-semibold">leaderboard</a>
              <button className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-white">
                sign up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900 opacity-50"></div>
        
        {/* Animated mesh gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.3) 0%, transparent 50%)`
          }}
        ></div>

        {/* Floating emoji particles */}
        {floatingEmojis.map((emoji, i) => (
          <div
            key={i}
            className="absolute text-4xl animate-float"
            style={{
              left: `${(i * 12 + 5)}%`,
              top: `${(i * 8 + 10)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i * 0.3}s`
            }}
          >
            {emoji}
          </div>
        ))}

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(147, 51, 234, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>

        <div className="relative z-10 text-center space-y-8 max-w-5xl mx-auto px-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-purple-500/50 rounded-full backdrop-blur-sm animate-pulse-glow">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
            <span className="text-purple-300 font-bold text-sm tracking-wider">NO CAP THE BEST QUIZ PLATFORM</span>
            <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
          </div>

          {/* Main Heading with glitch effect */}
          <div className="relative">
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-gradient-x pb-4"
                style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif' }}>
              QUIZO
            </h1>
            <div className="absolute inset-0 text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter text-purple-500 animate-glitch opacity-70 blur-sm"
                 style={{ fontFamily: '"Bebas Neue", "Impact", sans-serif' }}>
              QUIZO
            </div>
          </div>

          {/* Subheading */}
          <p className="text-xl sm:text-2xl md:text-4xl font-bold text-white animate-fade-in-up"
             style={{ 
               fontFamily: '"Space Mono", monospace',
               animationDelay: '0.2s',
               textShadow: '0 0 20px rgba(147, 51, 234, 0.5)'
             }}>
            where <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">ur brain</span> gets the <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">glow up</span> it deserves 💅
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 border border-purple-400/50 rounded-full backdrop-blur-sm hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">lightning fast</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-pink-600/30 border border-pink-400/50 rounded-full backdrop-blur-sm hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-semibold">flex ur scores</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-600/30 border border-cyan-400/50 rounded-full backdrop-blur-sm hover:scale-110 transition-transform">
              <Brain className="w-5 h-5 text-pink-400" />
              <span className="text-white font-semibold">big brain energy</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <button
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-black text-xl text-white overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                <span>START QUIZ</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </div>
              {isHovering && (
                <div className="absolute inset-0 animate-ping bg-purple-400 rounded-full opacity-20"></div>
              )}
            </button>
            
            <button className="px-8 py-4 border-2 border-purple-400 rounded-full font-bold text-xl text-purple-300 hover:bg-purple-600/20 transition-all duration-300 hover:scale-105">
              see leaderboard 👀
            </button>
          </div>

          {/* Stats Section */}
          <div className="flex flex-wrap justify-center gap-8 pt-12 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">10K+</div>
              <div className="text-purple-300 font-semibold">quizzes taken</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">5K+</div>
              <div className="text-purple-300 font-semibold">brains upgraded</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400">100%</div>
              <div className="text-purple-300 font-semibold">vibes immaculate</div>
            </div>
          </div>
        </div>

        {/* Decorative stars */}
        {[...Array(20)].map((_, i) => (
          <Star
            key={i}
            className="absolute text-purple-400 animate-twinkle"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`
            }}
          />
        ))}
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="relative py-24 px-4 bg-gradient-to-b from-black to-purple-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-600/20 border border-purple-500/50 rounded-full mb-4">
              <span className="text-purple-300 font-bold text-sm">WHY WE DIFFERENT</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-4"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              FEATURES THAT HIT DIFFERENT
            </h2>
            <p className="text-xl text-purple-300 font-semibold">we got all the sauce u need frfr 🔥</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`group p-8 rounded-2xl bg-gradient-to-br from-${feature.color}-600/10 to-${feature.color}-900/10 border border-${feature.color}-500/30 hover:border-${feature.color}-400/60 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${feature.color}-400 to-${feature.color}-600 flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: '"Space Mono", monospace' }}>
                  {feature.title}
                </h3>
                <p className="text-purple-300 text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section id="categories" className="relative py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-cyan-600/20 border border-cyan-500/50 rounded-full mb-4">
              <span className="text-cyan-300 font-bold text-sm">PICK UR POISON</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              QUIZ CATEGORIES
            </h2>
            <p className="text-xl text-purple-300 font-semibold">endless topics to test ur knowledge 🧠</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="group p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-black border border-purple-500/30 hover:border-purple-400/60 backdrop-blur-sm hover:scale-110 transition-all duration-300 cursor-pointer text-center"
              >
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">{cat.emoji}</div>
                <h3 className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${cat.color}`}>
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-full font-bold text-xl text-white hover:scale-105 transition-transform shadow-xl">
              explore all categories →
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-black to-purple-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-pink-600/20 border border-pink-500/50 rounded-full mb-4">
              <span className="text-pink-300 font-bold text-sm">SUPER SIMPLE</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 mb-4"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              HOW IT WORKS
            </h2>
            <p className="text-xl text-purple-300 font-semibold">literally 3 steps that's it 💅</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', title: 'pick a vibe', desc: 'choose ur category and difficulty level', icon: '🎯' },
              { num: '02', title: 'go crazy', desc: 'answer questions and rack up those points', icon: '💥' },
              { num: '03', title: 'flex hard', desc: 'flex ur score and climb the leaderboard', icon: '👑' }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="absolute -top-6 -left-6 text-8xl font-black text-purple-900/30">{step.num}</div>
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/30 backdrop-blur-sm">
                  <div className="text-6xl mb-4">{step.icon}</div>
                  <h3 className="text-2xl font-black text-white mb-3" style={{ fontFamily: '"Space Mono", monospace' }}>
                    {step.title}
                  </h3>
                  <p className="text-purple-300 text-lg">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="relative py-24 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-yellow-600/20 border border-yellow-500/50 rounded-full mb-4">
              <span className="text-yellow-300 font-bold text-sm">REAL TALK</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-4"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              WHAT THE PEOPLE SAY
            </h2>
            <p className="text-xl text-purple-300 font-semibold">dont just take our word for it 🗣️</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'alex', handle: '@alexthegreat', text: 'yo this site is UNREAL. i\'m literally addicted no cap 🔥', rating: 5 },
              { name: 'sarah', handle: '@sarahvibes', text: 'best way to kill time AND feel smart?? yes please 💯', rating: 5 },
              { name: 'mike', handle: '@mikecheck', text: 'finally beat my friend\'s high score. feeling ELITE rn 👑', rating: 5 }
            ].map((test, i) => (
              <div key={i} className="p-6 rounded-xl bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-purple-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
                <div className="flex gap-1 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white text-lg mb-4 italic">"{test.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                  <div>
                    <div className="text-white font-bold">{test.name}</div>
                    <div className="text-purple-400 text-sm">{test.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-black to-purple-950/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 backdrop-blur-lg">
            <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-6"
                style={{ fontFamily: '"Bebas Neue", sans-serif' }}>
              READY TO GLOW UP?
            </h2>
            <p className="text-2xl text-white mb-8 font-semibold">join thousands of big brain legends rn 🚀</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-black text-2xl text-white hover:scale-105 transition-transform shadow-2xl">
                START NOW
              </button>
              <button className="px-10 py-5 border-2 border-white rounded-full font-bold text-2xl text-white hover:bg-white/10 transition-all">
                learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="relative bg-black border-t border-purple-500/30 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  QUIZO
                </div>
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-purple-300 mb-4">where legends are made fr fr 💯</p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center hover:scale-110 transition-transform">
                  <Instagram className="w-5 h-5 text-purple-300" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center hover:scale-110 transition-transform">
                  <Twitter className="w-5 h-5 text-purple-300" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center hover:scale-110 transition-transform">
                  <Youtube className="w-5 h-5 text-purple-300" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-purple-600/30 border border-purple-500/50 flex items-center justify-center hover:scale-110 transition-transform">
                  <Github className="w-5 h-5 text-purple-300" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-black text-lg mb-4">QUICK LINKS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">home</a></li>
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">categories</a></li>
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">leaderboard</a></li>
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">about us</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-black text-lg mb-4">SUPPORT</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">help center</a></li>
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">contact us</a></li>
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">faq</a></li>
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">feedback</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-black text-lg mb-4">LEGAL</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">privacy policy</a></li>
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">terms of service</a></li>
                <li><a href="#" className="text-purple-300 hover:text-purple-400 transition-colors">cookie policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-purple-500/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-purple-400 text-sm">© 2026 Quizo. all rights reserved. stay bussin 🔥</p>
            <div className="flex gap-2 items-center">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-purple-300 text-sm">100% legit • 0% cap</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap');
        
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes glitch {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(147, 51, 234, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(147, 51, 234, 0.8);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
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

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }

        .animate-glitch {
          animation: glitch 1s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}