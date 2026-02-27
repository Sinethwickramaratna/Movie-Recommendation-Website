import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

    // Click outside handler to close dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced Search API Call
    useEffect(() => {
        const fetchSearchResults = async () => {
            if (searchQuery.trim().length < 2) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            try {
                const response = await fetch(`${API_BASE_URL}/movies/search?query=${encodeURIComponent(searchQuery)}&limit=5`);
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                fetchSearchResults();
            } else {
                setSearchResults([]);
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, API_BASE_URL]);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setShowDropdown(false);
            navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background-dark/70 backdrop-blur-xl animate-fade-in">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-10">
                    <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90 group">
                        <div className="relative flex size-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary/30 to-primary/10 text-primary ring-1 ring-primary/40">
                            <div className="absolute inset-0 rounded-full bg-primary/40 blur-md animate-pulse"></div>
                            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse delay-75"></div>
                            <span className="relative material-symbols-outlined text-2xl transition-transform group-hover:scale-110">movie_filter</span>
                        </div>
                        <h2 className="hidden text-xl font-bold tracking-tight text-white sm:block">
                            CineMatch<span className="text-primary">AI</span>
                        </h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1 bg-white/5 px-2 py-1.5 rounded-full border border-white/5">
                        <Link to="/" className={`px-4 py-1.5 text-sm font-semibold rounded-full shadow-sm transition-all ${location.pathname === '/' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-primary hover:bg-white/5'}`}>Home</Link>
                        <Link to="/movies" className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition-all ${location.pathname === '/movies' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-primary hover:bg-white/5'}`}>Movies</Link>
                        <Link to="/discover" className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition-all ${location.pathname === '/discover' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-primary hover:bg-white/5'}`}>Discover</Link>
                        <Link to="/watchlist" className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition-all ${location.pathname === '/watchlist' ? 'text-white bg-white/10' : 'text-slate-300 hover:text-primary hover:bg-white/5'}`}>Watchlist</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4 relative" ref={searchRef}>
                    <div className="hidden lg:group relative lg:flex lg:w-72 items-center">
                        <span className="material-symbols-outlined absolute left-3 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => {
                                if (searchQuery.trim().length >= 2) setShowDropdown(true);
                            }}
                            onKeyDown={handleSearchSubmit}
                            className="w-full rounded-full border border-white/10 bg-surface-dark/50 py-2 pl-10 pr-10 text-sm text-white placeholder-slate-500 backdrop-blur-sm transition-all focus:border-primary/50 focus:bg-surface-dark focus:outline-none focus:ring-1 focus:ring-primary/50"
                            placeholder="Search movies ..."
                        />
                        {isSearching && (
                            <span className="material-symbols-outlined absolute right-3 text-primary animate-spin text-sm">progress_activity</span>
                        )}
                        {!isSearching && searchQuery && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSearchResults([]);
                                    setShowDropdown(false);
                                }}
                                className="absolute right-3 text-slate-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        )}

                        {/* Search Dropdown Modal */}
                        {showDropdown && searchQuery.trim().length >= 2 && (
                            <div className="absolute top-full lg:mt-3 right-0 w-[320px] bg-background-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in z-50">
                                {isSearching && searchResults.length === 0 ? (
                                    <div className="p-6 text-center text-slate-400 text-sm">
                                        Searching for "{searchQuery}"...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="flex flex-col">
                                        <div className="max-h-[380px] overflow-y-auto no-scrollbar">
                                            {searchResults.map((movie) => (
                                                <Link
                                                    key={movie.movie_id}
                                                    to={`/movie/${movie.movie_id}`}
                                                    onClick={() => {
                                                        setShowDropdown(false);
                                                        setSearchQuery('');
                                                    }}
                                                    className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                                                >
                                                    <div className="w-12 h-16 flex-shrink-0 bg-surface-dark rounded overflow-hidden">
                                                        <img
                                                            src={movie.poster_path?.startsWith('http') ? movie.poster_path : `${IMAGE_BASE_URL}${movie.poster_path}`}
                                                            alt={movie.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/48x64/162a2d/0de3f2?text=NA' }}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-white text-sm font-medium truncate">{movie.title}</span>
                                                        <span className="text-slate-400 text-xs mt-1">
                                                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                                            {movie.language && ` • ${movie.language.toUpperCase()}`}
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <Link
                                            to={`/movies?search=${encodeURIComponent(searchQuery.trim())}`}
                                            onClick={() => {
                                                setShowDropdown(false);
                                                setSearchQuery('');
                                            }}
                                            className="p-3 text-center text-primary text-sm font-bold bg-white/5 hover:bg-primary/20 transition-colors border-t border-white/10"
                                        >
                                            View all results
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="p-6 text-center text-slate-400 text-sm">
                                        No movies found matching "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <button className="flex lg:hidden items-center justify-center text-slate-300 hover:text-white">
                        <span className="material-symbols-outlined">search</span>
                    </button>
                    <button className="ml-2 md:hidden text-white">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
