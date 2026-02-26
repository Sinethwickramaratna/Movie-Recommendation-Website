import React from 'react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background-dark/70 backdrop-blur-xl">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
                <div className="flex items-center gap-10">
                    <a className="flex items-center gap-3 transition-opacity hover:opacity-90 group" href="#">
                        <div className="relative flex size-10 items-center justify-center rounded-full bg-gradient-to-tr from-primary/30 to-primary/10 text-primary ring-1 ring-primary/40">
                            <div className="absolute inset-0 rounded-full bg-primary/40 blur-md animate-pulse"></div>
                            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse delay-75"></div>
                            <span className="relative material-symbols-outlined text-2xl transition-transform group-hover:scale-110">movie_filter</span>
                        </div>
                        <h2 className="hidden text-xl font-bold tracking-tight text-white sm:block">
                            CineMatch<span className="text-primary">AI</span>
                        </h2>
                    </a>
                    <nav className="hidden md:flex items-center gap-1 bg-white/5 px-2 py-1.5 rounded-full border border-white/5">
                        <a className="px-4 py-1.5 text-sm font-semibold text-white bg-white/10 rounded-full shadow-sm transition-all" href="#">Home</a>
                        <a className="px-4 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-primary hover:bg-white/5 rounded-full" href="#">Movies</a>
                        <a className="px-4 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-primary hover:bg-white/5 rounded-full" href="#">Discover</a>
                        <a className="px-4 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:text-primary hover:bg-white/5 rounded-full" href="#">Watchlist</a>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:group relative lg:flex lg:w-72 items-center">
                        <span className="material-symbols-outlined absolute left-3 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                        <input
                            className="w-full rounded-full border border-white/10 bg-surface-dark/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 backdrop-blur-sm transition-all focus:border-primary/50 focus:bg-surface-dark focus:outline-none focus:ring-1 focus:ring-primary/50"
                            placeholder="Search movies ..."
                            type="text"
                        />
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
