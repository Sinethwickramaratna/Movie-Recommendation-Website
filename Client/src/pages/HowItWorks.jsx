import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-primary selection:text-background-dark">
            <Header />

            <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col items-center text-center mb-16 space-y-4 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
                        <span className="material-symbols-outlined text-primary text-sm">lightbulb</span>
                        <span className="text-primary text-xs font-bold uppercase tracking-wider">The Magic Behind</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        How CineMatchAI Works
                    </h1>
                    <p className="text-slate-400 max-w-3xl text-lg mt-4" style={{ animationDelay: '0.2s' }}>
                        We combine cutting-edge artificial intelligence with vast cinematic databases to bring you
                        recommendations that perfectly align with your unique taste. Here's a look under the hood.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-purple-500/50 to-transparent -translate-x-1/2"></div>

                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-16 relative animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                        <div className="md:w-5/12 text-center md:text-right mb-6 md:mb-0 md:pr-10">
                            <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-center md:justify-end gap-2">
                                <span className="material-symbols-outlined text-primary">tune</span>
                                1. Tell Us What You Like
                            </h3>
                            <p className="text-slate-400">
                                Start by setting your preferences in our interactive Discover panel. Select your favorite genres,
                                desired release years, max runtime, preferred languages, and minimum ratings. You hold the controls.
                            </p>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-background-dark border-4 border-primary z-10">
                            <span className="text-primary font-bold">1</span>
                        </div>
                        <div className="md:w-5/12 bg-surface-dark/50 border border-white/5 p-6 rounded-2xl md:pl-10">
                            <div className="bg-background-dark/80 rounded-xl p-4 border border-white/5 flex gap-2">
                                <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full">Sci-Fi</span>
                                <span className="px-3 py-1 bg-white/5 text-slate-300 text-xs rounded-full border border-white/10">Action</span>
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">2020s</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row-reverse items-center justify-between mb-16 relative animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
                        <div className="md:w-5/12 text-center md:text-left mb-6 md:mb-0 md:pl-10">
                            <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-center md:justify-start gap-2">
                                <span className="material-symbols-outlined text-purple-400">psychology</span>
                                2. AI Analyzes the Matrix
                            </h3>
                            <p className="text-slate-400">
                                Our sophisticated recommendation engine kicks into high gear. It sifts through thousands of titles,
                                analyzing ratings, genres, preferred runtime, and whether a movie is considered average or not, to find the perfect matches.
                            </p>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-background-dark border-4 border-purple-500 z-10">
                            <span className="text-purple-400 font-bold">2</span>
                        </div>
                        <div className="md:w-5/12 bg-surface-dark/50 border border-white/5 p-6 rounded-2xl md:pr-10">
                            <div className="w-full flex justify-center py-4">
                                <span className="material-symbols-outlined text-6xl text-purple-400 animate-pulse">memory</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row items-center justify-between relative animate-slide-in-right" style={{ animationDelay: '0.8s' }}>
                        <div className="md:w-5/12 text-center md:text-right mb-6 md:mb-0 md:pr-10">
                            <h3 className="text-2xl font-bold text-white mb-3 flex items-center justify-center md:justify-end gap-2">
                                <span className="material-symbols-outlined text-accent-magenta">celebration</span>
                                3. Your Tailored Picks Arrive
                            </h3>
                            <p className="text-slate-400">
                                Instantly receive a highly curated list of movies you're almost guaranteed to love.
                                Add them to your watchlist, view deep insights, or hit play. The power of discovery is yours.
                            </p>
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-background-dark border-4 border-accent-magenta z-10">
                            <span className="text-accent-magenta font-bold">3</span>
                        </div>
                        <div className="md:w-5/12 bg-surface-dark/50 border border-white/5 p-6 rounded-2xl md:pl-10">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-800 rounded-lg aspect-[2/3] border border-white/10 relative overflow-hidden flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-white/20">movie</span>
                                    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                                </div>
                                <div className="bg-slate-800 rounded-lg aspect-[2/3] border border-white/10 relative overflow-hidden flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-white/20">movie</span>
                                    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex justify-center">
                    <Link to="/discover" className="group relative overflow-hidden bg-gradient-to-r from-primary to-cyan-400 text-background-dark font-black text-lg py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(13,227,242,0.4)] hover:shadow-[0_0_30px_rgba(13,227,242,0.6)] transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                        <span className="material-symbols-outlined">smart_toy</span>
                        Experience It Now
                    </Link>
                </div>
            </main>

            <Footer />
        </div>
    );
}
