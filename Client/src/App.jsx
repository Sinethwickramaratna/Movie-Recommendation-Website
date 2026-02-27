import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Watchlist from "./pages/Watchlist";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/watchlist" element={<Watchlist />} />
    </Routes>
  );
}

export default App
