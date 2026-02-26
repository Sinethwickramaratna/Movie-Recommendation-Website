import React from 'react';

export default function Footer() {
    return (
        <footer className="bg-surface-dark py-12 px-6 md:px-10 border-t border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                <div className="md:col-span-1">
                    <div className="flex items-center gap-2 text-white mb-4">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                            <span className="material-symbols-outlined text-lg">movie_filter</span>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight text-white">CineMatch AI</h2>
                    </div>
                    <p className="text-slate-400 text-sm">
                        Personalized movie recommendations powered by artificial intelligence. Find your next favorite film in seconds.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Browse</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a className="hover:text-primary transition-colors" href="#">Movies</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">TV Shows</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Documentaries</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">New Arrivals</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Support</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                        <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Terms of Service</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
                        <li><a className="hover:text-primary transition-colors" href="#">Contact Us</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4">Connect</h4>
                    <div className="flex gap-4">
                        <a className="text-slate-400 hover:text-white transition-colors" href="#">
                            <span className="material-symbols-outlined">public</span>
                        </a>
                        <a className="text-slate-400 hover:text-white transition-colors" href="#">
                            <span className="material-symbols-outlined">mail</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="text-center pt-8 border-t border-white/5 text-xs text-slate-500">
                © 2024 CineMatch AI. All rights reserved.
            </div>
        </footer>
    );
}
