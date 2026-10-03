import React from 'react';
import { X, Play, ExternalLink } from 'lucide-react';
import { Movie } from '../types/movie';

interface TrailerModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TrailerModal: React.FC<TrailerModalProps> = ({ movie, isOpen, onClose }) => {
  if (!isOpen || !movie) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-[#12141c] border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e1017]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Трейлер: {movie.title}</h3>
              <p className="text-xs text-slate-400">{movie.originalTitle} ({movie.year}) · Режиссёр: {movie.director}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${movie.youtubeTrailerId}?autoplay=1&rel=0`}
            title={`Трейлер ${movie.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#0e1017] text-xs text-slate-400">
          <span>{movie.eveningVerdict.atmosphere}</span>
          <a
            href={`https://www.youtube.com/watch?v=${movie.youtubeTrailerId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-amber-400 hover:underline"
          >
            Открыть на YouTube <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
