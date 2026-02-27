import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Movies() {
    const [minRating, setMinRating] = useState(0);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [sortBy, setSortBy] = useState('Latest');
    const [movies, setMovies] = useState([]);
    const [loadingMovies, setLoadingMovies] = useState(true);
    const [limit, setLimit] = useState(20);
    const [hasMore, setHasMore] = useState(true);

    const genreDropdownRef = useRef(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (genreDropdownRef.current && !genreDropdownRef.current.contains(event.target)) {
                setIsGenreOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/categories/list`);
                if (response.ok) {
                    const data = await response.json();
                    setGenres(data.categories || []);
                } else {
                    console.error('Failed to fetch genres');
                }
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        const fetchLanguages = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/languages/list`);
                if (response.ok) {
                    const data = await response.json();
                    setLanguages(data.languages || []);
                } else {
                    console.error('Failed to fetch languages');
                }
            } catch (error) {
                console.error('Error fetching languages:', error);
            }
        };

        fetchGenres();
        fetchLanguages();
    }, []);

    useEffect(() => {
        // Reset limit to 20 whenever any filter changes
        setLimit(20);
        setHasMore(true);
    }, [selectedGenres, selectedYear, minRating, selectedLanguage, sortBy]);

    useEffect(() => {
        const fetchMovies = async () => {
            // Only show main loading state if it is the first batch
            if (limit === 20) setLoadingMovies(true);
            try {
                // Build query string
                const params = new URLSearchParams();

                if (selectedGenres.length > 0) {
                    params.append('genres', selectedGenres.join(','));
                }

                if (selectedYear && selectedYear !== 'All Years') {
                    if (selectedYear.includes('-')) {
                        // Handling ranges like 2020-2024 is tricky with a single release_year param depending on backend support. 
                        // Assuming the backend accepts an exact year or we just pass the start year for now.
                        params.append('release_year', selectedYear.split('-')[0]);
                    } else if (selectedYear.includes('s')) {
                        // e.g., 2010s
                        params.append('release_year', selectedYear.replace('s', '0'));
                    } else {
                        params.append('release_year', selectedYear);
                    }
                }

                if (minRating > 0) {
                    params.append('min_vote', minRating);
                }

                if (selectedLanguage) {
                    params.append('language', selectedLanguage);
                }

                // Sorting
                if (sortBy === 'Latest') {
                    params.append('latest', 'true');
                } else {
                    params.append('latest', 'false');
                    // Note: Other sorts like 'Top Rated', 'Popularity', 'A-Z' might need a different URL param if backend supports it.
                }

                params.append('limit', limit.toString());

                const response = await fetch(`${API_BASE_URL}/movies/new_releases?${params.toString()}`);
                if (response.ok) {
                    const data = await response.json();

                    if (data.length < limit) {
                        setHasMore(false); // If we get fewer items than we asked for, there's no more
                    } else {
                        setHasMore(true);
                    }

                    // Since we're increasing the limit, the API returns the full set including the ones we already had
                    setMovies(data);
                } else {
                    console.error('Failed to fetch movies');
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoadingMovies(false);
            }
        };

        if (hasMore || limit === 20) {
            fetchMovies();
        }
    }, [selectedGenres, selectedYear, minRating, selectedLanguage, sortBy, limit]);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-primary selection:text-background-dark">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <Header />

                <main className="flex-grow">
                    {/* Hero Section */}
                    <header className="max-w-7xl mx-auto px-6 pt-12 pb-8">
                        <div className="relative p-8 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/5 overflow-hidden">
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
                            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-accent/10 blur-[100px] rounded-full"></div>
                            <div className="relative z-10">
                                <h2 className="text-5xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-primary">New Releases</h2>
                                <p className="text-lg text-primary/70 max-w-2xl">The latest cinematic masterpieces, freshly added to our collection. Experience stories that redefine the silver screen.</p>
                            </div>
                        </div>
                    </header>

                    {/* Filters Section */}
                    <section className="max-w-7xl mx-auto px-6 mb-8">
                        <div className="glass rounded-xl p-6 border border-primary/20">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end lg:grid-cols-5">
                                {/* Genre Filter */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/60 px-1">Genre</label>
                                    <div className="relative" ref={genreDropdownRef}>
                                        <div
                                            onClick={() => setIsGenreOpen(!isGenreOpen)}
                                            className="w-full bg-primary/5 border border-primary/20 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm text-slate-100 cursor-pointer flex justify-between items-center transition-all bg-background-dark/50"
                                        >
                                            <span className="truncate pr-4 text-slate-300">
                                                {selectedGenres.length === 0
                                                    ? 'All Genres'
                                                    : selectedGenres.map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(', ')}
                                            </span>
                                            <span className="material-symbols-outlined text-primary/60 pointer-events-none transition-transform duration-200" style={{ transform: isGenreOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                                        </div>

                                        {isGenreOpen && (
                                            <div className="absolute top-full left-0 mt-2 w-full bg-background-dark border border-primary/20 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto py-2 backdrop-blur-xl">
                                                <div
                                                    className={`px-4 py-2 cursor-pointer transition-colors hover:bg-primary/20 flex items-center justify-between ${selectedGenres.length === 0 ? 'text-primary bg-primary/10' : 'text-slate-300'}`}
                                                    onClick={() => { setSelectedGenres([]); setIsGenreOpen(false); }}
                                                >
                                                    <span>All Genres</span>
                                                    {selectedGenres.length === 0 && <span className="material-symbols-outlined text-sm">check</span>}
                                                </div>
                                                {genres.map(genre => {
                                                    const isSelected = selectedGenres.includes(genre.Genre_name);
                                                    return (
                                                        <div
                                                            key={genre.Genre_id}
                                                            className={`px-4 py-2 cursor-pointer transition-colors hover:bg-primary/20 flex items-center justify-between ${isSelected ? 'text-primary bg-primary/5' : 'text-slate-300'}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const name = genre.Genre_name;
                                                                if (isSelected) {
                                                                    setSelectedGenres(selectedGenres.filter(gName => gName !== name));
                                                                } else {
                                                                    setSelectedGenres([...selectedGenres, name]);
                                                                }
                                                            }}
                                                        >
                                                            <span>{genre.Genre_name.charAt(0).toUpperCase() + genre.Genre_name.slice(1)}</span>
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary/20 text-primary' : 'border-slate-500'}`}>
                                                                {isSelected && <span className="material-symbols-outlined text-[10px] font-bold">check</span>}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Year Filter */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/60 px-1">Release Year</label>
                                    <div className="relative">
                                        <select
                                            value={selectedYear}
                                            onChange={(e) => setSelectedYear(e.target.value)}
                                            className="w-full bg-primary/5 border border-primary/20 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm text-slate-100 appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-background-dark">All Years</option>
                                            <option value="2026" className="bg-background-dark">2026</option>
                                            <option value="2025" className="bg-background-dark">2025</option>
                                            <option value="2020-2024" className="bg-background-dark">2020-2024</option>
                                            <option value="2010s" className="bg-background-dark">2010s</option>
                                            <option value="2000s" className="bg-background-dark">2000s</option>
                                            <option value="1900-1999" className="bg-background-dark">1900-1999</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary/60 pointer-events-none">calendar_month</span>
                                    </div>
                                </div>

                                {/* Language Filter */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/60 px-1">Language</label>
                                    <div className="relative">
                                        <select
                                            value={selectedLanguage}
                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                            className="w-full bg-primary/5 border border-primary/20 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm text-slate-100 appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-background-dark">All Languages</option>
                                            {languages.map((language) => (
                                                <option key={language.Language_code} value={language.Language_name} className="bg-background-dark">
                                                    {language.Language_name.charAt(0).toUpperCase() + language.Language_name.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary/60 pointer-events-none">language</span>
                                    </div>
                                </div>

                                {/* TMDB Score Slider */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center px-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-primary/60">Min. TMDB Score</label>
                                        <span className="text-xs font-bold text-accent">{minRating > 0 ? `${minRating}+` : 'Any'}</span>
                                    </div>
                                    <input
                                        className="w-full h-1.5 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-accent"
                                        max="10"
                                        min="0"
                                        step="0.5"
                                        type="range"
                                        value={minRating}
                                        onChange={(e) => setMinRating(parseFloat(e.target.value))}
                                    />
                                    <div className="flex justify-between text-[10px] text-primary/40 px-1">
                                        <span>0</span>
                                        <span>5</span>
                                        <span>10</span>
                                    </div>
                                </div>

                                {/* Sort By */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-primary/60 px-1">Sort By</label>
                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full bg-primary/5 border border-primary/20 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-sm text-slate-100 appearance-none cursor-pointer"
                                        >
                                            <option value="Latest" className="bg-background-dark">Latest</option>
                                            <option value="Top Rated" className="bg-background-dark">Top Rated</option>
                                            <option value="Popularity" className="bg-background-dark">Popularity</option>
                                            <option value="A-Z" className="bg-background-dark">A-Z</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary/60 pointer-events-none">sort</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Movie Grid */}
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        {loadingMovies ? (
                            <div className="flex w-full items-center justify-center p-20 text-slate-400">
                                <span className="material-symbols-outlined animate-spin mr-3 text-3xl">progress_activity</span>
                                <span className="text-lg">Loading movies...</span>
                            </div>
                        ) : movies.length === 0 ? (
                            <div className="flex flex-col w-full items-center justify-center p-20 text-slate-400 gap-4">
                                <span className="material-symbols-outlined text-6xl opacity-50">movie_off</span>
                                <span className="text-xl">No movies found matching your filters.</span>
                                <button
                                    onClick={() => {
                                        setSelectedGenres([]);
                                        setMinRating(0);
                                        setSelectedYear('');
                                        setSelectedLanguage('');
                                        setSortBy('Latest');
                                    }}
                                    className="mt-4 px-6 py-2 rounded-full glass border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {movies.map((movie) => (
                                    <div key={movie.id || movie.title} className="movie-card group flex flex-col glass rounded-xl overflow-hidden transition-all duration-300 border border-transparent">
                                        <div className="relative aspect-[2/3] overflow-hidden">
                                            <div
                                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: `url('${movie.poster_path?.startsWith('http') ? movie.poster_path : `${IMAGE_BASE_URL}${movie.poster_path}`}')` }}
                                            />
                                            {/* Fallback image strategy could go here if backgroundImage fails */}
                                            {movie.vote_average > 0 && (
                                                <div className="absolute top-3 right-3 glass px-2 py-1 rounded-lg flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-yellow-400 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                    <span className="text-xs font-bold text-slate-100">{Number(movie.vote_average).toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-primary transition-colors line-clamp-1" title={movie.title}>{movie.title}</h3>
                                            <p className="text-sm text-primary/60 mb-4 line-clamp-1">
                                                {movie.release_date && (new Date(movie.release_date).getFullYear() || movie.release_date.substring(0, 4))}
                                                {movie.language && ` • ${movie.language.charAt(0).toUpperCase() + movie.language.slice(1)}`}
                                                {movie.genres && movie.genres.length > 0 && ` • ${movie.genres[0]}`}
                                            </p>
                                            <button className="mt-auto w-full bg-accent text-white py-2.5 rounded-lg font-bold text-sm neon-glow flex items-center justify-center gap-2 transition-all hover:bg-accent/90">
                                                <span className="material-symbols-outlined text-lg">add</span>
                                                Add to Watchlist
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Load More Section */}
                        {movies.length > 0 && hasMore && (
                            <div className="mt-16 flex flex-col items-center gap-6">
                                <button
                                    onClick={() => setLimit(prev => prev + 20)}
                                    className="px-12 py-4 rounded-xl glass border border-primary/30 text-primary font-bold hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(13,227,242,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center gap-3 group"
                                >
                                    Load More
                                    <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">keyboard_double_arrow_down</span>
                                </button>
                                <div className="flex items-center gap-2 text-sm text-primary/40">
                                    <span>Showing {movies.length} releases</span>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
