import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { addToWatchlist, isInWatchlist } from '../utils/watchlist';
import Toast from '../components/Toast';

export default function Discover() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

    // Form states
    const [availableGenres, setAvailableGenres] = useState([]);
    const [availableLanguages, setAvailableLanguages] = useState([]);

    // User selections
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [releaseYear, setReleaseYear] = useState(2024);
    const [runtimeRange, setRuntimeRange] = useState(120); // Using a single value for simplicity based on the UI provided, could expand to min/max
    const [minRating, setMinRating] = useState(7.5);
    const [selectedLanguage, setSelectedLanguage] = useState('');

    // Fetch states
    const [isGenerating, setIsGenerating] = useState(false);
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [watchlistSet, setWatchlistSet] = useState(new Set());
    const [toast, setToast] = useState({ message: '', type: '' });

    // Fetch initial filter lists (genres, languages)
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const [genresRes, langRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/categories/list`),
                    fetch(`${API_BASE_URL}/languages/list`)
                ]);

                if (genresRes.ok) {
                    const data = await genresRes.json();
                    setAvailableGenres(data.categories?.map(c => c.Genre_name) || []);
                }
                if (langRes.ok) {
                    const data = await langRes.json();
                    setAvailableLanguages(data.languages?.map(l => l.Language_name) || []);
                }
            } catch (error) {
                console.error("Failed to load filter definitions", error);
            }
        };
        fetchFilters();

        // Load initial watchlist status
        try {
            const currentWatchlistIds = JSON.parse(localStorage.getItem('watchlist') || '[]');
            setWatchlistSet(new Set(currentWatchlistIds));
        } catch (e) {
            console.error(e);
        }

        const handleWatchlistUpdate = () => {
            const currentWatchlistIds = JSON.parse(localStorage.getItem('watchlist') || '[]');
            setWatchlistSet(new Set(currentWatchlistIds));
        };
        window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
        return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);

    }, []);

    const toggleGenre = (genreName) => {
        setSelectedGenres(prev =>
            prev.includes(genreName)
                ? prev.filter(g => g !== genreName)
                : [...prev, genreName]
        );
    };

    const handleGenerateRecommendations = async () => {
        setIsGenerating(true);
        // Map language name to TMDB code based on available list if needed, or send name
        try {
            const payload = {
                genres: selectedGenres,
                release_year: parseInt(releaseYear),
                runtime: parseInt(runtimeRange),
                vote_average: parseFloat(minRating),
                language: selectedLanguage === 'Any Language' ? '' : selectedLanguage,
                adult: 0
            };

            const response = await fetch(`${API_BASE_URL}/movies/recommend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                setRecommendedMovies(data.recommended_movies || []);
            } else {
                setToast({ message: 'Failed to generate recommendations', type: 'error' });
            }
        } catch (error) {
            console.error("AI Generation Failed:", error);
            setToast({ message: 'Network error generating recommendations', type: 'error' });
        } finally {
            setIsGenerating(false);

            // Scroll to results smoothly
            setTimeout(() => {
                document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    const handleAddToWatchlist = (e, movie) => {
        e.preventDefault();
        e.stopPropagation();

        const movieId = movie.movie_id || movie.id;

        if (watchlistSet.has(movieId)) {
            setToast({ message: `${movie.title} is already in your watchlist`, type: 'info' });
            return;
        }

        const success = addToWatchlist(movieId);
        if (success) {
            setToast({ message: `Added ${movie.title} to watchlist`, type: 'success' });
            // Local state updates instantly via the event listener from useEffect
        } else {
            setToast({ message: `Failed to add ${movie.title}`, type: 'error' });
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 antialiased">
            <style>{`
                input[type=range] {
                    -webkit-appearance: none;
                    background: transparent;
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    background: #0de3f2;
                    cursor: pointer;
                    margin-top: -6px;
                    box-shadow: 0 0 10px rgba(13, 227, 242, 0.5);
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: #224649;
                    border-radius: 2px;
                }
                input[type=range].magenta-thumb::-webkit-slider-thumb {
                    background: #f20dcf;
                    box-shadow: 0 0 10px rgba(242, 13, 207, 0.5);
                }
                .glass-card {
                    background: rgba(22, 42, 45, 0.6);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(13, 227, 242, 0.1);
                }
            `}</style>

            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
            <Header />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                <div className="flex flex-col items-center text-center mb-12 space-y-4 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-2">
                        <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                        <span className="text-primary text-xs font-bold uppercase tracking-wider">AI Powered</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                        Find Your Next Obsession
                    </h1>
                    <p className="text-slate-400 max-w-2xl text-lg">
                        Tell our advanced AI what you're in the mood for, and let us curate a personalized list of cinematic masterpieces just for you.
                    </p>
                </div>

                <div className="glass-card rounded-2xl p-5 sm:p-8 mb-16 shadow-2xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-magenta/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
                        <div className="lg:col-span-8 space-y-8">

                            {/* Genres */}
                            <div>
                                <label className="block text-slate-300 text-sm font-bold mb-3 uppercase tracking-wide">Select Genres</label>
                                <div className="flex flex-wrap gap-3">
                                    {availableGenres.map(genre => {
                                        const isSelected = selectedGenres.includes(genre);
                                        return (
                                            <button
                                                key={genre}
                                                onClick={() => toggleGenre(genre)}
                                                className={`group flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm ${isSelected
                                                    ? 'bg-primary text-background-dark font-bold shadow-[0_0_10px_rgba(13,227,242,0.4)] border-primary'
                                                    : 'bg-surface-dark border-white/10 hover:border-primary/50 text-slate-300 hover:text-white'
                                                    }`}
                                            >
                                                {isSelected && <span className="material-symbols-outlined text-lg">check</span>}
                                                {genre}
                                            </button>
                                        );
                                    })}

                                    {availableGenres.length === 0 && (
                                        <div className="text-slate-500 text-sm animate-pulse">Loading genres...</div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Release Year */}
                                <div className="bg-surface-dark/30 rounded-xl p-4 sm:p-5 border border-white/5">
                                    <div className="flex justify-between items-end mb-4">
                                        <label className="text-slate-300 text-sm font-medium">Release Year</label>
                                        <span className="text-primary font-bold font-mono">{releaseYear}</span>
                                    </div>
                                    <div className="relative h-6 flex items-center w-full">
                                        <input
                                            type="range"
                                            min="1900"
                                            max="2026"
                                            value={releaseYear}
                                            onChange={(e) => setReleaseYear(e.target.value)}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                                        <span>1900</span>
                                        <span>2026</span>
                                    </div>
                                </div>

                                {/* Runtime */}
                                <div className="bg-surface-dark/30 rounded-xl p-4 sm:p-5 border border-white/5">
                                    <div className="flex justify-between items-end mb-4">
                                        <label className="text-slate-300 text-sm font-medium">Max Runtime (min)</label>
                                        <span className="text-primary font-bold font-mono">{runtimeRange}</span>
                                    </div>
                                    <div className="relative h-6 flex items-center w-full">
                                        <input
                                            type="range"
                                            min="60"
                                            max="300"
                                            value={runtimeRange}
                                            onChange={(e) => setRuntimeRange(e.target.value)}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-slate-500 font-mono">
                                        <span>60m</span>
                                        <span>5h</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-10">

                            {/* Min Rating */}
                            <div>
                                <div className="flex justify-between items-end mb-3">
                                    <label className="text-slate-300 text-sm font-bold uppercase tracking-wide">Min Rating</label>
                                    <div className="flex items-center gap-1 text-accent-magenta font-bold">
                                        <span className="material-symbols-outlined text-base">star</span>
                                        <span>{minRating}+</span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.1"
                                    value={minRating}
                                    onChange={(e) => setMinRating(e.target.value)}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer magenta-thumb"
                                />
                            </div>

                            {/* Language */}
                            <div>
                                <label className="block text-slate-300 text-sm font-bold mb-3 uppercase tracking-wide">Language</label>
                                <div className="relative">
                                    <select
                                        value={selectedLanguage}
                                        onChange={(e) => setSelectedLanguage(e.target.value)}
                                        className="w-full bg-surface-dark border border-white/10 text-white text-sm rounded-xl focus:ring-primary focus:border-primary block p-3 pr-10 appearance-none"
                                    >
                                        <option value="">Any Language</option>
                                        {availableLanguages.map((lang, index) => (
                                            <option key={index} value={lang}>{lang}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-auto pt-6">
                                <button
                                    onClick={handleGenerateRecommendations}
                                    disabled={isGenerating}
                                    className="w-full group relative overflow-hidden bg-gradient-to-r from-primary to-cyan-400 text-background-dark font-black text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(13,227,242,0.4)] hover:shadow-[0_0_30px_rgba(13,227,242,0.6)] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {isGenerating ? (
                                            <>
                                                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                                ANALYZING PREFERENCES...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined">smart_toy</span>
                                                GENERATE RECOMMENDATIONS
                                            </>
                                        )}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div id="results-section" className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">auto_awesome</span>
                            Top Picks For You
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {recommendedMovies.length > 0 ? (
                            recommendedMovies.map((movie, index) => {
                                const id = movie.movie_id || movie.id;
                                const isSaved = watchlistSet.has(id);

                                return (
                                    <Link key={id} to={`/movie/${id}`} className="group bg-surface-dark rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all hover:shadow-[0_0_20px_rgba(13,227,242,0.1)] flex flex-col h-full animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                        <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
                                            {movie.poster_path ? (
                                                <img
                                                    src={movie.poster_path.startsWith('http') ? movie.poster_path : `${IMAGE_BASE_URL}${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                    <span className="material-symbols-outlined text-4xl">movie</span>
                                                </div>
                                            )}

                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-accent-magenta font-bold text-xs flex items-center gap-1 border border-white/10">
                                                <span className="material-symbols-outlined text-sm">star</span> {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                                            </div>
                                        </div>

                                        <div className="p-4 flex flex-col flex-1">
                                            <h4 className="text-white font-bold text-lg mb-1 line-clamp-1">{movie.title}</h4>

                                            <div className="flex items-center flex-wrap gap-2 text-slate-400 text-xs mb-4">
                                                <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                                                <span className="size-1 bg-slate-600 rounded-full"></span>
                                                <span>{movie.genres?.slice(0, 2).join(', ') || 'Various'}</span>
                                                <span className="size-1 bg-slate-600 rounded-full"></span>
                                                <span className="uppercase">{movie.language || 'EN'}</span>
                                            </div>

                                            <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                                                {movie.overview || "No overview available for this movie."}
                                            </p>

                                            <button
                                                onClick={(e) => handleAddToWatchlist(e, movie)}
                                                className={`w-full mt-auto font-bold text-sm py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 ${isSaved
                                                    ? 'bg-transparent border border-white/10 text-slate-400 hover:bg-white/5'
                                                    : 'bg-transparent border border-accent-magenta/30 text-accent-magenta hover:bg-accent-magenta hover:text-white shadow-[0_0_10px_rgba(242,13,207,0.1)] hover:shadow-[0_0_15px_rgba(242,13,207,0.4)]'
                                                    }`}
                                            >
                                                {isSaved ? (
                                                    <><span className="material-symbols-outlined text-lg">check</span> Added</>
                                                ) : (
                                                    <><span className="material-symbols-outlined text-lg">add</span> Watchlist</>
                                                )}
                                            </button>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-20 text-center text-slate-500 flex flex-col items-center gap-3">
                                <span className="material-symbols-outlined text-5xl opacity-50">smart_toy</span>
                                <p className="text-lg">Select your preferences above and click Generate to see AI recommendations</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
