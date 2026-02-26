import React, { useState, useEffect } from 'react';


export default function NewReleases() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/movies/new_releases`)
            .then(res => {
                if (!res.ok) throw new Error('Network error');
                return res.json();
            })
            .then(data => {
                if (data && data.length > 0) {
                    setMovies(data);
                }
            })
            .catch(err => {
                console.error("Failed to fetch new releases.", err);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section className="px-6 pb-20 md:px-10 bg-surface-dark/30 pt-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl flex items-center gap-3">
                    <span className="h-8 w-1.5 rounded-full bg-secondary"></span>
                    New Releases
                </h2>
                <a className="text-sm font-medium text-primary hover:text-white transition-colors" href="#">View All</a>
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
                                    <button className="flex size-12 items-center justify-center rounded-full bg-primary text-background-dark hover:scale-110 transition-transform">
                                        <span className="material-symbols-outlined fill-current">play_arrow</span>
                                    </button>
                                    <button className="flex items-center gap-1 rounded-full bg-secondary px-4 py-1.5 text-xs font-bold text-white hover:bg-secondary/80 transition-colors">
                                        <span className="material-symbols-outlined text-sm">add</span> Watchlist
                                    </button>
                                </div>
                            </div>
                            <div>
                                <h3 className="truncate text-base font-bold text-white transition-colors group-hover:text-primary" title={movie.title}>
                                    {movie.title}
                                </h3>
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
