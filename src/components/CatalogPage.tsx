import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Play, 
  Bookmark, 
  Check, 
  Clock, 
  Star, 
  Dices, 
  SlidersHorizontal,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { Movie, EveningMood, CompanyType, DurationCategory } from '../types/movie';
import { MovieCard } from './MovieCard';

interface CatalogPageProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  onOpenTrailer: (movie: Movie) => void;
  onOpenRoulette: () => void;
  watchlist: Movie[];
  onToggleBookmark: (movie: Movie) => void;
  finderRef: React.RefObject<HTMLDivElement | null>;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  movies,
  onSelectMovie,
  onOpenTrailer,
  onOpenRoulette,
  watchlist,
  onToggleBookmark,
  finderRef,
}) => {
  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'duration-asc' | 'duration-desc' | 'year'>('rating');

  // Matcher state
  const [quizCompany, setQuizCompany] = useState<CompanyType | 'any'>('any');
  const [quizMood, setQuizMood] = useState<EveningMood | 'any'>('any');
  const [quizDuration, setQuizDuration] = useState<DurationCategory | 'any'>('any');

  // Featured Movie: clean recommendation
  const featuredMovie = movies[0]; // e.g. "Песнь моря"
  const isFeaturedBookmarked = watchlist.some((m) => m.id === featuredMovie.id);

  // Filter & Search Logic
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      // Text search
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matches =
          movie.title.toLowerCase().includes(query) ||
          movie.originalTitle.toLowerCase().includes(query) ||
          movie.director.toLowerCase().includes(query) ||
          movie.genres.some((g) => g.toLowerCase().includes(query));
        if (!matches) return false;
      }

      // Category tab
      if (selectedMoodFilter === 'cozy' && !movie.moods.includes('cozy')) return false;
      if (selectedMoodFilter === 'aesthetic' && !movie.moods.includes('aesthetic')) return false;
      if (selectedMoodFilter === 'deep' && !movie.moods.includes('deep')) return false;
      if (selectedMoodFilter === 'thriller' && !movie.moods.includes('thriller')) return false;
      if (selectedMoodFilter === 'comedy' && !movie.moods.includes('comedy')) return false;
      if (selectedMoodFilter === 'short' && movie.duration >= 105) return false;

      // Matcher filters
      if (quizCompany !== 'any' && !movie.suitableFor.includes(quizCompany)) return false;
      if (quizMood !== 'any' && !movie.moods.includes(quizMood)) return false;
      if (quizDuration === 'short' && movie.duration >= 105) return false;
      if (quizDuration === 'standard' && (movie.duration < 105 || movie.duration > 140)) return false;
      if (quizDuration === 'epic' && movie.duration <= 140) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.ratingKp - a.ratingKp;
      if (sortBy === 'duration-asc') return a.duration - b.duration;
      if (sortBy === 'duration-desc') return b.duration - a.duration;
      if (sortBy === 'year') return b.year - a.year;
      return 0;
    });
  }, [movies, searchQuery, selectedMoodFilter, sortBy, quizCompany, quizMood, quizDuration]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedMoodFilter('all');
    setQuizCompany('any');
    setQuizMood('any');
    setQuizDuration('any');
  };

  const isMatcherActive = quizCompany !== 'any' || quizMood !== 'any' || quizDuration !== 'any';

  return (
    <div className="min-w-0 flex-1 pb-20">

      {/* 1. Concise, High-Impact Hero: Featured Movie */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0c0e14]">
        
        {/* Soft background glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <img
            src={featuredMovie.posterPath}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-3xl scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-[#0c0e14]/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
            
            {/* Left Info Column */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              
              {/* Header Label */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Фильм сегодняшнего вечера</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-cinematic">
                {featuredMovie.title}
              </h1>

              {/* Core Metadata (paler/muted) */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-xs sm:text-sm text-slate-500 mt-2 font-normal">
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {featuredMovie.ratingKp} КП
                </span>
                <span className="text-slate-600">·</span>
                <span>{featuredMovie.year}</span>
                <span className="text-slate-600">·</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {featuredMovie.duration} мин
                </span>
                <span className="text-slate-600">·</span>
                <span>{featuredMovie.genres.join(', ')}</span>
                <span className="text-slate-600">·</span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono text-[11px]">
                  {featuredMovie.ageRating}
                </span>
              </div>

              {/* Direct, non-cluttered synopsis (2-3 lines max) */}
              <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed max-w-2xl line-clamp-3">
                {featuredMovie.synopsis}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-6">
                <button
                  onClick={() => onSelectMovie(featuredMovie)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>О фильме</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onOpenTrailer(featuredMovie)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Трейлер</span>
                </button>

                <button
                  onClick={() => onToggleBookmark(featuredMovie)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isFeaturedBookmarked
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  title={isFeaturedBookmarked ? 'В списке' : 'Сохранить на вечер'}
                >
                  {isFeaturedBookmarked ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* Right Poster Column */}
            <div className="shrink-0">
              <div 
                className="relative group cursor-pointer w-48 sm:w-56 md:w-60 rounded-2xl overflow-hidden shadow-2xl border border-white/10 transition-transform duration-200 hover:scale-[1.02]"
                onClick={() => onSelectMovie(featuredMovie)}
              >
                <img
                  src={featuredMovie.posterPath}
                  alt={featuredMovie.title}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[3/4.2] object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/75 text-white">
                    Смотреть детали →
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Compact & Visual Movie Finder (No text clutter) */}
      <section 
        ref={finderRef}
        className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="p-5 sm:p-6 rounded-2xl bg-[#12141c] border border-white/10">
          
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-white font-cinematic">
                Подбор фильма по настроению
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {isMatcherActive && (
                <button
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded bg-white/5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Сброс</span>
                </button>
              )}
              <span className="text-xs text-slate-400">
                Подходит: <strong className="text-amber-400 tabular-nums">{filteredMovies.length}</strong>
              </span>
            </div>
          </div>

          {/* Quick Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 text-xs">
            
            {/* 1. Компания */}
            <div>
              <span className="text-slate-400 block mb-2 font-medium">С кем смотрите:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'any', label: 'Не важно' },
                  { id: 'solo', label: 'Один' },
                  { id: 'couple', label: 'Вдвоем' },
                  { id: 'family', label: 'Семья' },
                  { id: 'friends', label: 'Друзья' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setQuizCompany(item.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      quizCompany === item.id
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'bg-[#181b26] text-slate-300 hover:bg-[#202535]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Настроение */}
            <div>
              <span className="text-slate-400 block mb-2 font-medium">Настроение:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'any', label: 'Любое' },
                  { id: 'cozy', label: 'Уютное' },
                  { id: 'aesthetic', label: 'Красивое' },
                  { id: 'thriller', label: 'Интрига' },
                  { id: 'comedy', label: 'Юмор' },
                  { id: 'deep', label: 'Смысл' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setQuizMood(item.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      quizMood === item.id
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'bg-[#181b26] text-slate-300 hover:bg-[#202535]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Время */}
            <div>
              <span className="text-slate-400 block mb-2 font-medium">Хронометраж:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'any', label: 'Любой' },
                  { id: 'short', label: 'До 100 мин' },
                  { id: 'standard', label: 'Около 2 ч' },
                  { id: 'epic', label: '2+ часа' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setQuizDuration(item.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                      quizDuration === item.id
                        ? 'bg-amber-400 text-stone-950 font-bold'
                        : 'bg-[#181b26] text-slate-300 hover:bg-[#202535]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Search & Tabs */}
      <section className="mx-auto max-w-7xl px-4 pt-4 pb-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {[
              { id: 'all', label: 'Все фильмы' },
              { id: 'short', label: 'До 100 мин' },
              { id: 'cozy', label: 'Уютные' },
              { id: 'thriller', label: 'Интрига' },
              { id: 'comedy', label: 'Комедии' },
              { id: 'deep', label: 'Драмы' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedMoodFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedMoodFilter === tab.id
                    ? 'bg-amber-400 text-stone-950 font-semibold'
                    : 'bg-[#141722] text-slate-300 hover:text-white hover:bg-[#1a1e2d]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#141722] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-2.5 rounded-lg bg-[#141722] border border-white/10 text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="rating">Рейтинг</option>
              <option value="duration-asc">Короткие сначала</option>
              <option value="duration-desc">Длинные сначала</option>
              <option value="year">По году</option>
            </select>
          </div>

        </div>
      </section>

      {/* 4. Movie Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-2">
        {filteredMovies.length === 0 ? (
          <div className="py-12 text-center rounded-2xl bg-[#12141c] border border-white/5 p-6">
            <p className="text-sm font-semibold text-white">Ничего не найдено</p>
            <p className="text-xs text-slate-400 mt-1">Попробуйте изменить параметры поиска или фильтров</p>
            <button
              onClick={resetAllFilters}
              className="mt-3 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-semibold cursor-pointer"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onSelectMovie={onSelectMovie}
                onOpenTrailer={onOpenTrailer}
                isBookmarked={watchlist.some((m) => m.id === movie.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. Minimalist Quick Roulette Callout */}
      <section className="mx-auto max-w-7xl px-4 mt-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-xl bg-[#12141c] border border-white/10 text-center sm:text-left">
          <div>
            <span className="text-xs font-semibold text-amber-400">Сложно определиться?</span>
            <p className="text-sm font-bold text-white mt-0.5">
              Случайный выбор на этот вечер
            </p>
          </div>
          <button
            onClick={onOpenRoulette}
            className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Dices className="w-3.5 h-3.5" />
            <span>Запустить рулетку</span>
          </button>
        </div>
      </section>

    </div>
  );
};
