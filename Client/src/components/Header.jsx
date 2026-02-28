import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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
            <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 sm:gap-10">
                    <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90 group">
                        <div className="relative flex size-8 sm:size-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary/30 to-primary/10 text-primary ring-1 ring-primary/40">
                            <div className="absolute inset-0 rounded-full bg-primary/40 blur-md animate-pulse"></div>
                            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse delay-75"></div>
                            <span className="relative material-symbols-outlined text-xl sm:text-2xl transition-transform group-hover:scale-110">movie_filter</span>
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

                <div className="flex items-center gap-2 sm:gap-4 relative" ref={searchRef}>
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
                    <button onClick={() => { setIsMobileSearchOpen(!isMobileSearchOpen); setIsMobileMenuOpen(false); }} className="flex lg:hidden h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-xl sm:text-2xl">search</span>
                    </button>
                    <button onClick={() => { setIsMobileMenuOpen(!isMobileMenuOpen); setIsMobileSearchOpen(false); }} className="md:hidden flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full text-white hover:bg-white/10 active:bg-white/20 transition-colors sm:ml-1 cursor-pointer">
                        <span className="material-symbols-outlined text-xl sm:text-2xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {isMobileSearchOpen && (
                <div className="absolute top-full left-0 w-full bg-background-dark/95 backdrop-blur-xl p-4 border-b border-white/10 lg:hidden animate-fade-in text-white shadow-2xl z-50">
                    <form
                        className="relative flex items-center"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (searchQuery.trim()) {
                                setShowDropdown(false);
                                setIsMobileSearchOpen(false);
                                navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
                                setSearchQuery('');
                            }
                        }}
                    >
                        <button type="submit" className="absolute left-3 flex items-center justify-center text-slate-400 hover:text-primary p-2">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowDropdown(true);
                            }}
                            className="w-full rounded-full border border-white/10 bg-surface-dark/50 py-3 pl-12 pr-12 text-base text-white placeholder-slate-500 backdrop-blur-sm focus:border-primary/50 focus:bg-surface-dark focus:outline-none focus:ring-1 focus:ring-primary/50"
                            placeholder="Search movies ..."
                            autoFocus
                        />
                        {searchQuery && (
                            <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 text-slate-400 hover:text-white p-2 flex items-center justify-center">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        )}
                    </form>
                    {/* Mobile Dropdown */}
                    {showDropdown && searchResults.length > 0 && (
                        <div className="mt-3 flex flex-col max-h-[60vh] overflow-y-auto w-full bg-surface-dark rounded-xl border border-white/10">
                            {searchResults.map((movie) => (
                                <Link key={movie.movie_id} to={`/movie/${movie.movie_id}`} onClick={() => { setShowDropdown(false); setIsMobileSearchOpen(false); setSearchQuery(''); }} className="flex items-center gap-3 p-3 border-b border-white/5 last:border-0 hover:bg-white/5">
                                    <img src={movie.poster_path?.startsWith('http') ? movie.poster_path : `${IMAGE_BASE_URL}${movie.poster_path}`} className="w-10 h-14 object-cover rounded" onError={(e) => e.target.src = 'https://via.placeholder.com/40x56/162a2d/0de3f2'} alt="" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{movie.title}</span>
                                        <span className="text-xs text-slate-400">{movie.release_date ? movie.release_date.split('-')[0] : ''}</span>
                                    </div>
                                </Link>
                            ))}
                            <Link to={`/movies?search=${encodeURIComponent(searchQuery)}`} onClick={() => { setShowDropdown(false); setIsMobileSearchOpen(false); setSearchQuery(''); }} className="p-3 text-center text-primary text-sm font-bold bg-white/5">View all results</Link>
                        </div>
                    )}
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-background-dark/95 backdrop-blur-xl border-b border-white/10 md:hidden animate-fade-in text-white p-4 flex flex-col gap-2 shadow-2xl z-50">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-white/5'}`}>Home</Link>
                    <Link to="/movies" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/movies' ? 'bg-primary/10 text-primary' : 'hover:bg-white/5'}`}>Movies</Link>
                    <Link to="/discover" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/discover' ? 'bg-primary/10 text-primary' : 'hover:bg-white/5'}`}>Discover</Link>
                    <Link to="/watchlist" onClick={() => setIsMobileMenuOpen(false)} className={`px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/watchlist' ? 'bg-primary/10 text-primary' : 'hover:bg-white/5'}`}>Watchlist</Link>
                </div>
            )}
        </header>
    );
}
