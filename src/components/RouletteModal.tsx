import React, { useState } from 'react';
import { X, Sparkles, Dices, ArrowRight, Clock, Star } from 'lucide-react';
import { Movie } from '../types/movie';

interface RouletteModalProps {
  movies: Movie[];
  isOpen: boolean;
  onClose: () => void;
  onSelectMovie: (movie: Movie) => void;
}

export const RouletteModal: React.FC<RouletteModalProps> = ({
  movies,
  isOpen,
  onClose,
  onSelectMovie,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (spinning || movies.length === 0) return;
    setSpinning(true);
    let counter = 0;
    const totalFlips = 16;
    const intervalTime = 70;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * movies.length);
      setSelectedMovie(movies[randomIndex]);
      counter++;

      if (counter >= totalFlips) {
        clearInterval(interval);
        setSpinning(false);
      }
    }, intervalTime);
  };

  const current = selectedMovie || movies[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-[#12141c] border border-amber-500/20 shadow-2xl p-6 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium tracking-wide mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Вечерняя кинорулетка</span>
          </div>
          <h3 className="text-2xl font-cinematic font-bold text-white tracking-tight">
            Не знаете, что включить?
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Доверьтесь случаю! Рулетка выберет идеальную картину на этот вечер за пару секунд.
          </p>
        </div>

        {/* Selected Movie Preview Card */}
        <div className={`relative p-5 rounded-xl border transition-all duration-300 ${spinning ? 'scale-[0.98] border-amber-500/40 bg-[#171a24]' : 'border-white/10 bg-[#151822]'}`}>
          <div className="flex gap-4 items-center">
            <div className="w-24 h-36 shrink-0 rounded-lg overflow-hidden bg-stone-900 border border-white/10 shadow-md">
              <img
                src={current.posterPath}
                alt={current.title}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover transition-opacity duration-150 ${spinning ? 'opacity-80 blur-[0.5px]' : 'opacity-100'}`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" /> {current.ratingKp} КП
                </span>
                <span>·</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" /> {current.duration} мин
                </span>
              </div>
              <h4 className="text-lg font-bold text-white truncate font-cinematic">
                {current.title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {current.originalTitle} · {current.year} · реж. {current.director}
              </p>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {current.eveningVerdict.whyTonight}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleSpin}
            disabled={spinning}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            <Dices className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`} />
            <span>{spinning ? 'Выбираем...' : 'Крутить рулетку'}</span>
          </button>

          <button
            onClick={() => {
              onSelectMovie(current);
              onClose();
            }}
            disabled={spinning}
            className="w-full sm:w-1/2 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98] cursor-pointer"
          >
            <span>Открыть страницу фильма</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
