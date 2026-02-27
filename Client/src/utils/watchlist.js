export const addToWatchlist = (movie_id) => {
    if (!movie_id) return false;
    try {
        const currentWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        if (!currentWatchlist.includes(movie_id)) {
            currentWatchlist.push(movie_id);
            localStorage.setItem('watchlist', JSON.stringify(currentWatchlist));
            window.dispatchEvent(new Event('watchlistUpdated'));
            return true;
        }
        return false;
    } catch (e) {
        console.error('Failed to update watchlist', e);
        return false;
    }
};

export const removeFromWatchlist = (movie_id) => {
    if (!movie_id) return false;
    try {
        const currentWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        const newWatchlist = currentWatchlist.filter(id => id !== movie_id);
        if (newWatchlist.length !== currentWatchlist.length) {
            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
            window.dispatchEvent(new Event('watchlistUpdated'));
            return true;
        }
        return false;
    } catch (e) {
        console.error('Failed to remove from watchlist', e);
        return false;
    }
}

export const isInWatchlist = (movie_id) => {
    if (!movie_id) return false;
    try {
        const currentWatchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
        return currentWatchlist.includes(movie_id);
    } catch (e) {
        return false;
    }
}
