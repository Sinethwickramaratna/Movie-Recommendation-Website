import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Trendings from '../components/Trendings';
import NewReleases from '../components/NewReleases';
import Footer from '../components/Footer';

export default function HomePage() {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col antialiased selection:bg-primary selection:text-background-dark">
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <Header />

                <main className="flex-grow">
                    <HeroSection />
                    <Trendings />
                    <NewReleases />
                </main>

                <Footer />
            </div>
        </div>
    );
}
