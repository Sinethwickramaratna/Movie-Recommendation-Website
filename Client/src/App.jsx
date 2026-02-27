import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";
import Discover from "./pages/Discover";
import HowItWorks from "./pages/HowItWorks";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
    </Routes>
  );
}

export default App
