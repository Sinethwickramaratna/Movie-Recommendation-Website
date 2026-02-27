import React, { useState, useEffect } from 'react';
import { addToWatchlist, isInWatchlist } from '../utils/watchlist';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';


export default function NewReleases() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [watchlistSet, setWatchlistSet] = useState(new Set());
    const [toast, setToast] = useState({ message: '', type: '' });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/movies/new_releases?limit=10`)
            .then(res => {
                if (!res.ok) throw new Error('Network error');
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    setMovies(data);

                    const newWatchlistSet = new Set();
                    data.forEach(movie => {
                        const mId = movie.movie_id || movie.id;
                        if (isInWatchlist(mId)) {
                            newWatchlistSet.add(mId);
                        }
                    });
                    setWatchlistSet(newWatchlistSet);
                }
            })
            .catch(err => {
                console.error("Failed to fetch new releases.", err);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="px-6 pb-20 md:px-10 bg-surface-dark/30 pt-12">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl flex items-center gap-3">
                    <span className="h-8 w-1.5 rounded-full bg-secondary"></span>
                    New Releases
                </h2>
                <Link to="/movies" className="text-sm font-medium text-primary hover:text-white transition-colors">View All</Link>
            </div>

            {loading ? (
                <div className="flex w-full items-center justify-center p-12 text-slate-400">
                    <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                    Loading new releases...
                </div>
            ) : movies.length === 0 ? (
                <div className="flex w-full items-center justify-center p-12 text-slate-400">
                    No new releases found.
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {movies.map((movie, idx) => (
                        <div key={idx} className="group flex flex-col gap-3">
                            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-dark border border-white/5">
                                <img
                                    alt={`${movie.title} poster`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    src={movie.poster_path?.startsWith('http') ? movie.poster_path : `${IMAGE_BASE_URL}${movie.poster_path}`}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/280x420/162a2d/0de3f2?text=No+Image' }}
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background-dark/80 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                                    <Link to={`/movie/${movie.movie_id || movie.id}`} className="flex size-12 items-center justify-center rounded-full bg-primary text-background-dark hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined fill-current">play_arrow</span>
                                    </Link>
                                    {(() => {
                                        const mId = movie.movie_id || movie.id;
                                        const inWatchlist = watchlistSet.has(mId);
                                        return (
                                            <button
                                                onClick={() => {
                                                    if (inWatchlist) {
                                                        setToast({ message: `${movie.title} is already in your Watchlist.`, type: 'error' });
                                                        return;
                                                    }
                                                    const success = addToWatchlist(mId);
                                                    if (success) {
                                                        setWatchlistSet(new Set(watchlistSet).add(mId));
                                                        setToast({ message: `Added ${movie.title} to Watchlist!`, type: 'success' });
                                                    }
                                                }}
                                                className={`flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-300 group/watch ${inWatchlist ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 cursor-pointer hover:bg-emerald-500/30" : "bg-surface-dark border border-white/20 text-white hover:bg-primary/30 hover:text-primary hover:border-primary hover:neon-glow hover:scale-110 active:scale-95"}`}
                                            >
                                                {inWatchlist ? (
                                                    <>
                                                        <span className="material-symbols-outlined text-sm">check</span> Added
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover/watch:rotate-90">add</span> Watchlist
                                                    </>
                                                )}
                                            </button>
                                        )
                                    })()}
                                </div>
                            </div>
                            <div>
                                <Link to={`/movie/${movie.movie_id || movie.id}`}>
                                    <h3 className="truncate text-base font-bold text-white transition-colors group-hover:text-primary" title={movie.title}>
                                        {movie.title}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                                    <span>{movie.genres?.[0] || 'Movie'}</span>
                                    {movie.release_date && (
                                        <>
                                            <span className="size-1 rounded-full bg-slate-600 block"></span>
                                            <span>{new Date(movie.release_date).getFullYear() || movie.release_date.substring(0, 4)}</span>
                                        </>
                                    )}
                                    {movie.language && (
                                        <>
                                            <span className="size-1 rounded-full bg-slate-600 block"></span>
                                            <span className="uppercase">{movie.language}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
