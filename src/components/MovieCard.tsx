import React, { useState } from 'react';
import { Bookmark, Play, Star, Clock, Check } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onSelectMovie: (movie: Movie) => void;
  onOpenTrailer: (movie: Movie) => void;
  isBookmarked: boolean;
  onToggleBookmark: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onSelectMovie,
  onOpenTrailer,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative flex flex-col rounded-2xl bg-[#12141c] border border-white/10 hover:border-amber-500/50 transition-all duration-200 hover:shadow-xl hover:shadow-black/60 overflow-hidden">
      
      {/* Poster Box */}
      <div 
        className="relative aspect-[3/4.2] w-full overflow-hidden bg-[#181a24] cursor-pointer"
        onClick={() => onSelectMovie(movie)}
      >
        {!imageError ? (
          <img
            src={movie.posterPath}
            alt={movie.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className={`w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br ${movie.posterVisual.gradient}`}>
            <span className="text-xs font-mono text-white/70">{movie.year}</span>
            <p className="text-xl font-cinematic font-bold text-white leading-tight">
              {movie.title}
            </p>
            <p className="text-xs text-white/60">{movie.director}</p>
          </div>
        )}

        {/* Ambient Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12141c] via-transparent to-black/50 opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {/* Rating */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400 tabular-nums">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{movie.ratingKp}</span>
          </div>

          {/* Quick Bookmark Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(movie);
            }}
            className={`pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-500/40'
                : 'bg-black/60 text-white hover:bg-black/90 hover:text-amber-300'
            }`}
            title={isBookmarked ? 'В списке' : 'Сохранить на вечер'}
            aria-label="Сохранить фильм"
          >
            {isBookmarked ? <Check className="w-4 h-4 stroke-[3]" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Trailer Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenTrailer(movie);
            }}
            className="pointer-events-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs shadow-lg transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Трейлер</span>
          </button>
        </div>

        {/* Bottom runtime overlay */}
        <div className="absolute bottom-2.5 right-3 pointer-events-none">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[11px] font-medium text-slate-300 tabular-nums">
            <Clock className="w-3 h-3 text-amber-400" />
            {movie.duration} мин
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="flex flex-col flex-1 p-4">
        
        {/* Title */}
        <h3 
          onClick={() => onSelectMovie(movie)}
          className="text-base font-bold text-white group-hover:text-amber-400 transition-colors cursor-pointer font-cinematic line-clamp-1"
        >
          {movie.title}
        </h3>

        {/* Clean Metadata Line (pale/muted) */}
        <p className="text-xs text-slate-500 mt-1 truncate">
          {movie.year} · {movie.genres.slice(0, 2).join(', ')} · реж. {movie.director}
        </p>

        {/* Concise Synopsis (max 2 lines, straightforward) */}
        <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed flex-1">
          {movie.synopsis}
        </p>

        {/* Bottom Action Bar */}
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-[11px] text-slate-400">
            {movie.streaming[0]?.name ? `Онлайн: ${movie.streaming[0].name}` : movie.ageRating}
          </span>

          <button
            onClick={() => onSelectMovie(movie)}
            className="text-xs font-semibold text-amber-400 group-hover:text-amber-300 hover:underline cursor-pointer"
          >
            О фильме →
          </button>
        </div>

      </div>
    </div>
  );
};
