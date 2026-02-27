import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { addToWatchlist, isInWatchlist } from '../utils/watchlist';

export default function MovieDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ message: '', type: '' });
    const [inWatchlist, setInWatchlist] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

    useEffect(() => {
        setInWatchlist(isInWatchlist(parseInt(id) || id));

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const [movieRes, castRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/movies/${id}`),
                    fetch(`${API_BASE_URL}/movies/${id}/cast`)
                ]);

                if (movieRes.ok) {
                    const movieData = await movieRes.json();
                    setMovie(movieData);
                }

                if (castRes.ok) {
                    const castData = await castRes.json();
                    setCast(castData.slice(0, 10)); // Top 10 cast
                }
            } catch (err) {
                console.error("Failed to fetch movie details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleWatchlist = () => {
        if (inWatchlist) {
            setToast({ message: `${movie?.title || 'Movie'} is already in your Watchlist.`, type: 'error' });
            return;
        }
        const mId = parseInt(id) || id;
        const success = addToWatchlist(mId);
        if (success) {
            setInWatchlist(true);
            setToast({ message: `Added ${movie?.title || 'Movie'} to Watchlist!`, type: 'success' });
        }
    };

    if (loading) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center text-white font-body">
                <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-body">
                <Header />
                <div className="flex-grow flex items-center justify-center text-white">
                    <h2 className="text-2xl">Movie not found.</h2>
                </div>
                <Footer />
            </div>
        );
    }

    const formatRuntime = (minutes) => {
        if (!minutes) return 'N/A';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const bgImage = movie.backdrop_path
        ? (movie.backdrop_path.startsWith('http') ? movie.backdrop_path : `${IMAGE_BASE_URL}${movie.backdrop_path}`)
        : '';

    const posterImage = movie.poster_path
        ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${IMAGE_BASE_URL}${movie.poster_path}`)
        : 'https://via.placeholder.com/280x420/162a2d/0de3f2?text=No+Image';

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-body overflow-x-hidden min-h-screen flex flex-col">
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />

            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/90 to-transparent z-10"></div>
                {bgImage && (
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${bgImage}')` }}
                    ></div>
                )}
            </div>

            <div className="relative z-50">
                <Header />
            </div>

            <div className="relative z-10 flex flex-col flex-grow w-full max-w-[1440px] mx-auto pt-6">
                <main className="flex-grow p-6 lg:p-10 flex flex-col gap-8">
                    <div className="flex items-center justify-between">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group">
                            <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                            <span className="text-sm font-medium font-display">Back</span>
                        </button>
                        <div className="flex items-center gap-2 text-sm">
                            <Link to="/movies" className="text-text-muted hover:text-white">Movies</Link>
                            <span className="text-text-muted">/</span>
                            <span className="text-white font-medium truncate max-w-[150px] md:max-w-[300px]">{movie.title}</span>
                        </div>
                    </div>

                    <div className="bg-background-dark/85 backdrop-blur-md rounded-2xl p-6 lg:p-10 shadow-2xl border border-border-color/50 mb-10">
                        <div className="flex flex-col lg:flex-row gap-10">
                            <div className="flex-shrink-0 mx-auto lg:mx-0 w-64 md:w-80 lg:w-[360px] relative group">
                                <div className="absolute -inset-1 bg-primary rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                                    <div
                                        className="w-full h-full bg-cover bg-center transform transition-transform duration-500 group-hover:scale-105"
                                        style={{ backgroundImage: `url('${posterImage}')` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex flex-col flex-1 gap-6">
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight">{movie.title}</h1>
                                    <div className="flex flex-wrap items-center gap-4 text-text-muted text-sm md:text-base mt-2">
                                        {movie.adult ? (
                                            <span className="px-2 py-0.5 rounded border border-text-muted/30 text-xs font-bold uppercase tracking-wider text-rose-500">R</span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded border border-text-muted/30 text-xs font-bold uppercase tracking-wider text-white">PG-13</span>
                                        )}
                                        <span>{movie.release_date && (new Date(movie.release_date).getFullYear() || movie.release_date.substring(0, 4))}</span>
                                        <span>•</span>
                                        <span>{formatRuntime(movie.runtime)}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-sm text-primary">language</span>
                                            <span className="text-white uppercase">{movie.original_language || 'EN'}</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 mt-2">
                                    <button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-background-dark px-6 py-3 rounded-xl font-bold transition-all hover:shadow-[0_0_20px_rgba(13,227,242,0.4)] transform hover:-translate-y-0.5">
                                        <span className="material-symbols-outlined">play_arrow</span>
                                        <span>Watch Trailer</span>
                                    </button>
                                    <button
                                        onClick={handleWatchlist}
                                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all group border ${inWatchlist ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-background-card hover:bg-white/10 text-white border-border-color"}`}
                                    >
                                        <span className={`material-symbols-outlined transition-colors ${inWatchlist ? "" : "group-hover:text-primary"}`}>
                                            {inWatchlist ? 'check_circle' : 'bookmark_add'}
                                        </span>
                                        <span>{inWatchlist ? 'Saved to Watchlist' : 'Add to Watchlist'}</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6 border-y border-border-color/50">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-yellow-400 fill-current">star</span>
                                            <span className="text-2xl font-bold font-display text-white">{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                                        </div>
                                        <span className="text-text-muted text-xs uppercase tracking-wider">TMDB Score</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold font-display text-white">{movie.vote_count || 0}</span>
                                        </div>
                                        <span className="text-text-muted text-xs uppercase tracking-wider">Reviews</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold font-display text-white">{movie.popularity ? `${~~movie.popularity}` : 'N/A'}</span>
                                        </div>
                                        <span className="text-text-muted text-xs uppercase tracking-wider">Popularity</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {movie.genres && typeof movie.genres[0] === 'object' ? (
                                        movie.genres.map((g, i) => (
                                            <Link key={i} to={`/movies`} className="px-4 py-1.5 rounded-full bg-background-dark border border-border-color text-text-muted hover:text-primary hover:border-primary transition-colors text-sm">
                                                {g.name}
                                            </Link>
                                        ))
                                    ) : movie.genres && typeof movie.genres[0] === 'string' ? (
                                        movie.genres.map((g, i) => (
                                            <Link key={i} to={`/movies`} className="px-4 py-1.5 rounded-full bg-background-dark border border-border-color text-text-muted hover:text-primary hover:border-primary transition-colors text-sm">
                                                {g}
                                            </Link>
                                        ))
                                    ) : null}
                                </div>

                                <div className="flex flex-col gap-3">
                                    <h3 className="text-lg font-bold font-display text-white">Synopsis</h3>
                                    <p className="text-gray-300 leading-relaxed text-base font-light">
                                        {movie.overview || "No synopsis available."}
                                    </p>
                                </div>

                                {cast && cast.length > 0 && (
                                    <div className="flex flex-col gap-4 mt-2">
                                        <h3 className="text-lg font-bold font-display text-white">Top Cast</h3>
                                        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                            {cast.map((person, idx) => (
                                                <div key={idx} className="flex flex-col items-center gap-2 min-w-[80px]">
                                                    <div
                                                        className="size-16 rounded-full bg-cover bg-center border border-border-color"
                                                        style={{ backgroundImage: `url('${person.profile_path ? (person.profile_path.startsWith('http') ? person.profile_path : `${IMAGE_BASE_URL}${person.profile_path}`) : 'https://via.placeholder.com/150'}')` }}
                                                    ></div>
                                                    <div className="text-center">
                                                        <p className="text-white text-xs font-medium truncate max-w-[80px]">{person.name}</p>
                                                        <p className="text-text-muted text-[10px] truncate max-w-[80px]">{person.character}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}
