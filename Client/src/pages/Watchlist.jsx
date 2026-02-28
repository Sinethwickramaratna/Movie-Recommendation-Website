import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { removeFromWatchlist, isInWatchlist } from '../utils/watchlist';
import Toast from '../components/Toast';

export default function Watchlist() {
    const [savedMovies, setSavedMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: '', type: '' });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    const loadWatchlistData = async () => {
        setLoading(true);
        try {
            const currentWatchlistIds = JSON.parse(localStorage.getItem('watchlist') || '[]');

            if (currentWatchlistIds.length === 0) {
                setSavedMovies([]);
                setLoading(false);
                return;
            }

            // Fetch metadata for all saved IDs concurrently
            const moviePromises = currentWatchlistIds.map(async (id) => {
                if (!id) return null;
                try {
                    const res = await fetch(`${API_BASE_URL}/movies/${id}`);
                    if (res.ok) {
                        return await res.json();
                    }
                    return null;
                } catch (e) {
                    console.error(`Failed to fetch movie ${id}:`, e);
                    return null;
                }
            });

            const fetchedMovies = await Promise.all(moviePromises);
            // Filter out any failed requests
            setSavedMovies(fetchedMovies.filter(m => m !== null));
        } catch (error) {
            console.error("Failed to load watchlist data", error);
            setToast({ message: 'Failed to load watchlist', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWatchlistData();

        // Listen for standard watchlist updates from other components
        const handleWatchlistUpdate = () => {
            loadWatchlistData();
        };

        window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
        return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
    }, []);

    const handleRemove = (movieId, movieTitle) => {
        const success = removeFromWatchlist(movieId);
        if (success) {
            setToast({ message: `Removed ${movieTitle} from watchlist`, type: 'success' });
            // The watchlistUpdated event fired by removeFromWatchlist will trigger loadWatchlistData
        } else {
            setToast({ message: `Failed to remove ${movieTitle}`, type: 'error' });
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-primary selection:text-background-dark">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <Header />

                <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">My Watchlist</h1>
                            <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-2xl">Your personalized queue of cinematic adventures awaiting discovery.</p>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-xl bg-primary text-background-dark font-bold text-sm shadow-lg shadow-primary/25 transition-transform hover:scale-105">
                                All
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                Movies
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                Series
                            </button>
                            <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                                Unwatched
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
                        </div>
                    ) : savedMovies.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                            {savedMovies.map((movie) => (
                                <div key={movie.movie_id || movie.id} className="group relative flex flex-col gap-3">
                                    <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-xl shadow-black/20 dark:shadow-black/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                            style={{ backgroundImage: `url(${movie.poster_path ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${IMAGE_BASE_URL}${movie.poster_path}`) : 'https://via.placeholder.com/280x420/162a2d/0de3f2?text=No+Image'})` }}
                                        ></div>
                                        <div className="absolute inset-0 bg-black/60 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm p-4">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleRemove(movie.movie_id || movie.id, movie.title);
                                                }}
                                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/80 lg:bg-red-500/20 hover:bg-red-500/40 text-white lg:text-red-400 border border-red-500/50 backdrop-blur-md transition-all duration-200 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer z-10"
                                            >
                                                <span className="material-symbols-outlined text-sm">delete</span>
                                                <span className="text-xs font-bold uppercase tracking-wider">Remove</span>
                                            </button>
                                            <Link
                                                to={`/movie/${movie.movie_id || movie.id}`}
                                                className="size-10 rounded-full bg-primary text-background-dark flex items-center justify-center hover:scale-110 transition-transform cursor-pointer z-10 mt-auto mb-2"
                                            >
                                                <span className="material-symbols-outlined">play_arrow</span>
                                            </Link>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight truncate">
                                            {movie.title}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded">
                                                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                            </span>
                                            <span className="text-slate-500 dark:text-slate-500 text-xs font-medium truncate">
                                                {movie.genres?.join(' • ') || 'Various'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="mt-20">
                            <div className="flex flex-col items-center gap-8 rounded-2xl border-2 border-dashed border-slate-700/50 bg-slate-800/20 px-6 py-20 text-center">
                                <div className="size-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-500 mb-2">
                                    <span className="material-symbols-outlined text-4xl">movie_filter</span>
                                </div>
                                <div className="flex max-w-[480px] flex-col items-center gap-3">
                                    <p className="text-white text-2xl font-bold leading-tight tracking-tight">Your watchlist is empty</p>
                                    <p className="text-slate-400 text-base font-normal leading-relaxed">
                                        Looks like you haven't saved any movies yet. The universe of cinema is vast—start exploring to add titles to your list.
                                    </p>
                                </div>
                                <Link
                                    to="/movies"
                                    className="group flex items-center justify-center gap-2 overflow-hidden rounded-xl h-12 px-8 bg-primary text-background-dark text-base font-bold leading-normal transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25"
                                >
                                    <span>Start Exploring</span>
                                    <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </div>
    );
}
