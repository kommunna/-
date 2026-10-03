import React from 'react';
import { 
  Bookmark, 
  Check, 
  Play, 
  Star, 
  Clock, 
  Tv, 
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieDetailPageProps {
  movie: Movie;
  allMovies: Movie[];
  onBack: () => void;
  onSelectMovie: (movie: Movie) => void;
  onOpenTrailer: (movie: Movie) => void;
  isBookmarked: boolean;
  onToggleBookmark: (movie: Movie) => void;
}

export const MovieDetailPage: React.FC<MovieDetailPageProps> = ({
  movie,
  allMovies,
  onSelectMovie,
  onOpenTrailer,
  isBookmarked,
  onToggleBookmark,
}) => {
  const similarMovies = allMovies
    .filter((m) => m.id !== movie.id && m.moods.some((mood) => movie.moods.includes(mood)))
    .slice(0, 3);

  return (
    <div className="min-w-0 flex-1 pb-20 animate-in fade-in duration-200">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#0c0d12] border-b border-white/10">
        
        {/* Soft Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
          <img
            src={movie.posterPath}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover blur-3xl scale-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d12] via-[#0c0d12]/80 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
            
            {/* Left: Poster with Trailer Trigger */}
            <div className="w-full sm:w-60 md:w-72 shrink-0">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black/60">
                <img
                  src={movie.posterPath}
                  alt={movie.title}
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[3/4.2] object-cover"
                />
                <button
                  onClick={() => onOpenTrailer(movie)}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 hover:bg-black/15 transition-all text-white group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/90 group-hover:bg-amber-400 group-hover:scale-105 flex items-center justify-center text-stone-950 transition-all shadow-lg">
                    <Play className="w-5 h-5 fill-current translate-x-0.5" />
                  </div>
                  <span className="text-[11px] font-semibold mt-2 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md">
                    Трейлер
                  </span>
                </button>
              </div>

              {/* Streaming Platforms */}
              <div className="mt-3 p-3 rounded-xl bg-[#141722] border border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5">
                  <Tv className="w-3.5 h-3.5 text-amber-400" />
                  <span>Где смотреть:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {movie.streaming.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-white/5 text-[11px] text-slate-300"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Key Facts & Actions */}
            <div className="flex-1 min-w-0">
              
              {/* Ratings & Country */}
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-current" /> {movie.ratingKp} КП
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 tabular-nums">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-current" /> {movie.ratingImdb} IMDb
                </span>
                <span className="text-xs text-slate-500 ml-1">{movie.country}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-cinematic">
                {movie.title}
              </h1>

              {/* Paler Metadata under title */}
              <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                {movie.originalTitle} · {movie.year}
              </p>

              {/* Paler Essential Parameters line */}
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500 mt-2.5 font-normal">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {movie.duration} мин
                </span>
                <span className="text-slate-600">·</span>
                <span>{movie.genres.join(', ')}</span>
                <span className="text-slate-600">·</span>
                <span>Реж. {movie.director}</span>
                <span className="text-slate-600">·</span>
                <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-mono text-[11px]">
                  {movie.ageRating}
                </span>
              </div>

              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button
                  onClick={() => onOpenTrailer(movie)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Включить трейлер</span>
                </button>

                <button
                  onClick={() => onToggleBookmark(movie)}
                  className={`px-4 py-2.5 rounded-xl border transition-colors flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer ${
                    isBookmarked
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                      : 'bg-white/10 border-white/10 text-white hover:bg-white/15'
                  }`}
                >
                  {isBookmarked ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>В вашем списке</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Смотреть сегодня</span>
                    </>
                  )}
                </button>
              </div>

              {/* Critic Advice Card: ALWAYS OPEN / EXPANDED */}
              <div className="mt-6 border border-white/10 rounded-xl bg-[#141722] p-4 text-xs text-slate-300 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-amber-400">
                  <Lightbulb className="w-4 h-4 shrink-0" />
                  <span>Совет кинокритика: почему стоит включить именно сегодня</span>
                </div>
                <p className="leading-relaxed text-slate-300">
                  {movie.eveningVerdict.whyTonight}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-[11px] text-slate-400 border-t border-white/5">
                  <div>
                    <span className="text-amber-400 block font-semibold mb-0.5">🍷 С чем смотреть:</span>
                    <span>{movie.eveningVerdict.pairings.foodOrDrink}</span>
                  </div>
                  <div>
                    <span className="text-amber-400 block font-semibold mb-0.5">💡 Свет:</span>
                    <span>{movie.eveningVerdict.pairings.lightAndSetup}</span>
                  </div>
                  <div>
                    <span className="text-amber-400 block font-semibold mb-0.5">👥 Компания:</span>
                    <span>{movie.eveningVerdict.pairings.bestAudience}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Plot & Key Details */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main: Synopsis and Cast */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Plot */}
            <div>
              <h2 className="text-lg font-bold text-white font-cinematic mb-2">
                Сюжет
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {movie.synopsis}
              </p>
            </div>

            {/* Cast List */}
            <div>
              <h3 className="text-base font-bold text-white font-cinematic mb-3">
                В главных ролях
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {movie.cast.map((actor, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#141722] border border-white/5">
                    <p className="text-xs font-semibold text-white">{actor.name}</p>
                    <p className="text-[11px] text-slate-400 italic truncate">{actor.role}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trivia (Short & Clean) */}
            {movie.trivia.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-white font-cinematic mb-3">
                  Интересный факт
                </h3>
                <div className="p-3.5 rounded-xl bg-[#141722] border border-white/5 text-xs text-slate-300 leading-relaxed">
                  {movie.trivia[0]}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Quick Specs & Similar Movies */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Specs Table */}
            <div className="p-4 rounded-xl bg-[#12141c] border border-white/10 text-xs space-y-2.5">
              <h3 className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">
                О фильме
              </h3>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Режиссёр</span>
                <span className="font-semibold text-white">{movie.director}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Год</span>
                <span className="font-semibold text-white">{movie.year}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Хронометраж</span>
                <span className="font-semibold text-white">{movie.duration} мин</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">Страна</span>
                <span className="font-semibold text-white">{movie.country}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Возраст</span>
                <span className="font-semibold text-white">{movie.ageRating}</span>
              </div>
            </div>

            {/* Similar Movies: RENAMED TO "Похожие фильмы" */}
            {similarMovies.length > 0 && (
              <div className="p-4 rounded-xl bg-[#12141c] border border-white/10 text-xs">
                <h3 className="font-semibold text-amber-400 uppercase tracking-wider text-[11px] mb-3">
                  Похожие фильмы
                </h3>
                <div className="space-y-3">
                  {similarMovies.map((sim) => (
                    <div
                      key={sim.id}
                      onClick={() => onSelectMovie(sim)}
                      className="group flex gap-2.5 items-center p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <img
                        src={sim.posterPath}
                        alt={sim.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-14 object-cover rounded shrink-0 border border-white/10"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 truncate font-cinematic">
                          {sim.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {sim.year} · {sim.duration} мин · ★ {sim.ratingKp}
                        </p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};
