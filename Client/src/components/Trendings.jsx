import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';


export default function Trendings() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    useEffect(() => {
        setLoading(true);
        fetch(`${API_BASE_URL}/movies/trending`)
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
                console.error("Failed to fetch trending movies.", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <section className="relative z-10 -mt-10 px-4 sm:px-6 pb-12 md:px-10">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white md:text-3xl flex items-center gap-2 sm:gap-3">
                    <span className="h-8 w-1.5 rounded-full bg-primary"></span>
                    Trending Now
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={scrollLeft}
                        className="flex size-10 items-center justify-center rounded-full bg-surface-dark border border-white/10 text-white hover:border-primary hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button
                        onClick={scrollRight}
                        className="flex size-10 items-center justify-center rounded-full bg-surface-dark border border-white/10 text-white hover:border-primary hover:text-primary transition-colors"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="no-scrollbar flex gap-6 overflow-x-auto pb-8 scroll-smooth"
            >
                {loading ? (
                    <div className="flex w-full items-center justify-center p-12 text-slate-400">
                        <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
                        Loading trending movies...
                    </div>
                ) : movies.length === 0 ? (
                    <div className="flex w-full items-center justify-center p-12 text-slate-400">
                        No trending movies found.
                    </div>
                ) : (
                    movies.map((movie, idx) => (
                        <div key={idx} className="group relative min-w-[240px] flex-shrink-0 cursor-pointer md:min-w-[280px]">
                            <Link to={`/movie/${movie.movie_id || movie.id}`} className="block w-full h-full">
                                <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-surface-dark border border-white/5">
                                    <img
                                        alt={`${movie.title} poster`}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        src={movie.poster_path?.startsWith('http') ? movie.poster_path : `${IMAGE_BASE_URL}${movie.poster_path}`}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/280x420/162a2d/0de3f2?text=No+Image' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100"></div>
                                </div>
                                <div className="absolute bottom-0 p-4 w-full">
                                    <h3 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2" title={movie.title}>{movie.title}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-300 flex-wrap">
                                        <span>{movie.genres?.[0] || 'Movie'}</span>
                                        {movie.release_date && (
                                            <>
                                                <span className="size-1 rounded-full bg-slate-500"></span>
                                                <span>{new Date(movie.release_date).getFullYear() || movie.release_date.substring(0, 4)}</span>
                                            </>
                                        )}
                                        {movie.language && (
                                            <>
                                                <span className="size-1 rounded-full bg-slate-500"></span>
                                                <span className="uppercase">{movie.language}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                    )))}
            </div>
        </section>
    );
}
