import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
    const navigate = useNavigate();
    return (
        <div className="relative w-full">
            <div className="relative flex min-h-[600px] flex-col items-center justify-center px-4 py-20 text-center md:px-10">
                <div
                    className="absolute inset-0 z-0 h-full w-full bg-cover bg-center"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCVpv5xdHyIyHe04rLdqEvJbIE35DAt-kZ0wdXtevTsLRNU1Vr6uXOL8MsRHQVhjFuSceb6Z9xyz3GNh8cJmwf6REv7h63X9P2xr8gAsdZEXJx57MZiLrt4Ao3tDPQE73TlgTvtTFvd2iAJ-Ld-yCTFeMyUq-92w_3pa7cBDxZCFNAWomQp_ihSxeP51VcxUEF4byBgjAeuOgcdAvS215yTX0kIhShq2CeSkoUid5rsF6bRzuqnW39uKMv5cMbLLmWEcC9xWrezVMo-')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-background-dark/40"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-background-dark/90 via-transparent to-background-dark/90"></div>
                    <div className="absolute left-0 top-1/4 h-1/2 w-1/3 bg-primary/30 blur-[120px] rounded-full animate-blob opacity-100 mix-blend-screen"></div>
                    <div className="absolute left-1/3 top-1/4 h-1/2 w-1/3 bg-purple-500/20 blur-[130px] rounded-full animate-blob opacity-100 mix-blend-screen" style={{ animationDelay: "2.5s" }}></div>
                    <div className="absolute right-0 top-1/4 h-1/2 w-1/3 bg-secondary/30 blur-[120px] rounded-full animate-blob opacity-100 mix-blend-screen" style={{ animationDelay: "5s" }}></div>
                </div>

                <div className="relative z-10 flex max-w-4xl flex-col items-center gap-6 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 backdrop-blur-sm animate-fade-in">
                        <span className="material-symbols-outlined text-sm text-primary">auto_awesome</span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">AI-Powered Discovery</span>
                    </div>
                    <h1 className="text-5xl font-black leading-tight tracking-tight text-white md:text-7xl lg:text-[5rem] animate-slide-in-right">
                        Discover Movies <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">You'll Love</span>
                    </h1>
                    <p className="max-w-2xl text-lg text-slate-300 md:text-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        Stop scrolling, start watching. Our advanced AI analyzes your unique taste to recommend hidden gems and blockbusters tailored just for you.
                    </p>
                    <div className="mt-4 flex w-full flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <button onClick={() => navigate('/discover')} className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-bold text-background-dark transition-all hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(13,227,242,0.4)]">
                            <span className="material-symbols-outlined">smart_toy</span>
                            Get AI Recommendations
                        </button>
                        <button onClick={() => navigate('/how-it-works')} className="flex h-14 items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 px-8 text-base font-bold text-white transition-all hover:bg-white/20">
                            <span className="material-symbols-outlined">play_circle</span>
                            How it Works
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
