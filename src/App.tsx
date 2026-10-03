import { useState, useEffect, useRef } from 'react';
import { MOVIES } from './data/movies';
import { Movie } from './types/movie';
import { Navbar } from './components/Navbar';
import { CatalogPage } from './components/CatalogPage';
import { MovieDetailPage } from './components/MovieDetailPage';
import { TrailerModal } from './components/TrailerModal';
import { RouletteModal } from './components/RouletteModal';
import { WatchlistModal } from './components/WatchlistModal';

export default function App() {
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  
  // Watchlist persisted in localStorage
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('vecherfilm_watchlist');
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        return MOVIES.filter((m) => ids.includes(m.id));
      }
    } catch {
      // ignore
    }
    return [MOVIES[0], MOVIES[2]]; // default sample items for rich first load
  });

  const finderRef = useRef<HTMLDivElement | null>(null);

  // Sync hash routing: #/movie/<id> or #/
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/movie/')) {
        const id = hash.replace('#/movie/', '');
        const exists = MOVIES.find((m) => m.id === id);
        if (exists) {
          setSelectedMovieId(id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      setSelectedMovieId(null);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    window.location.hash = `#/movie/${movie.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setSelectedMovieId(null);
    window.location.hash = '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleBookmark = (movie: Movie) => {
    setWatchlist((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      const next = exists ? prev.filter((m) => m.id !== movie.id) : [...prev, movie];
      try {
        localStorage.setItem('vecherfilm_watchlist', JSON.stringify(next.map((m) => m.id)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleRemoveFromWatchlist = (movieId: string) => {
    setWatchlist((prev) => {
      const next = prev.filter((m) => m.id !== movieId);
      try {
        localStorage.setItem('vecherfilm_watchlist', JSON.stringify(next.map((m) => m.id)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleScrollToFinder = () => {
    finderRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectedMovie = selectedMovieId ? MOVIES.find((m) => m.id === selectedMovieId) || null : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d12] text-[#e2e8f0] selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Universal Top Bar */}
      <Navbar
        currentView={selectedMovie ? 'detail' : 'catalog'}
        onNavigateHome={handleNavigateHome}
        onOpenRoulette={() => setIsRouletteOpen(true)}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
        onScrollToFinder={handleScrollToFinder}
        watchlistCount={watchlist.length}
      />

      {/* Main Pages: 1. Каталог фильмов для знакомства, 2. Страница выбранного фильма */}
      <main className="flex-1">
        {selectedMovie ? (
          <MovieDetailPage
            movie={selectedMovie}
            allMovies={MOVIES}
            onBack={handleNavigateHome}
            onSelectMovie={handleSelectMovie}
            onOpenTrailer={(m) => setTrailerMovie(m)}
            isBookmarked={watchlist.some((m) => m.id === selectedMovie.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : (
          <CatalogPage
            movies={MOVIES}
            onSelectMovie={handleSelectMovie}
            onOpenTrailer={(m) => setTrailerMovie(m)}
            onOpenRoulette={() => setIsRouletteOpen(true)}
            watchlist={watchlist}
            onToggleBookmark={handleToggleBookmark}
            finderRef={finderRef}
          />
        )}
      </main>

      {/* Modals */}
      <TrailerModal
        movie={trailerMovie}
        isOpen={Boolean(trailerMovie)}
        onClose={() => setTrailerMovie(null)}
      />

      <RouletteModal
        movies={MOVIES}
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        onSelectMovie={handleSelectMovie}
      />

      <WatchlistModal
        watchlist={watchlist}
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        onRemove={handleRemoveFromWatchlist}
        onSelectMovie={handleSelectMovie}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0a0b0f] py-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-cinematic font-bold text-slate-300 tracking-wider">ВЕЧЕРФИЛЬМ</span>
            <span>·</span>
            <span>Сервис выбора фильма на вечер</span>
          </div>
          <p className="text-slate-500 text-center sm:text-right">
            Кураторская подборка картин мирового и авторского кинематографа.
          </p>
        </div>
      </footer>

    </div>
  );
}
