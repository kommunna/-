import React from 'react';
import { X, Bookmark, Trash2, ArrowRight, Clock, Star, Film } from 'lucide-react';
import { Movie } from '../types/movie';

interface WatchlistModalProps {
  watchlist: Movie[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (movieId: string) => void;
  onSelectMovie: (movie: Movie) => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  watchlist,
  isOpen,
  onClose,
  onRemove,
  onSelectMovie,
}) => {
  if (!isOpen) return null;

  const totalMinutes = watchlist.reduce((acc, m) => acc + m.duration, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#12141c] border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0e1017]">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400">
              <Bookmark className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Закладки</h3>
              <p className="text-xs text-slate-400">
                {watchlist.length > 0
                  ? `Сохранено фильмов: ${watchlist.length} · Общий хронометраж: ${Math.floor(totalMinutes / 60)} ч ${totalMinutes % 60} мин`
                  : 'Пока список пуст'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {watchlist.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Film className="w-12 h-12 mx-auto mb-3 opacity-30 text-amber-400" />
              <p className="text-sm text-slate-300 font-medium">Вы еще не добавили фильмы на вечер</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Нажимайте на значок закладки у любого фильма в каталоге, чтобы собрать список кандидатов на сегодняшний просмотр.
              </p>
            </div>
          ) : (
            watchlist.map((movie) => (
              <div
                key={movie.id}
                className="group flex items-center justify-between p-3.5 rounded-xl bg-[#171a24] border border-white/5 hover:border-amber-500/30 transition-all"
              >
                <div 
                  className="flex items-center gap-4 min-w-0 cursor-pointer flex-1"
                  onClick={() => {
                    onSelectMovie(movie);
                    onClose();
                  }}
                >
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-12 h-18 object-cover rounded-lg shrink-0 border border-white/10"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-white group-hover:text-amber-400 transition-colors truncate font-cinematic">
                      {movie.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>{movie.year}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {movie.duration} мин
                      </span>
                      <span>·</span>
                      <span className="text-amber-400 font-medium flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" /> {movie.ratingKp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1 italic">
                      {movie.eveningVerdict.pairings.bestAudience}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => {
                      onSelectMovie(movie);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Смотреть</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemove(movie.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Удалить из списка"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {watchlist.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-white/10 bg-[#0e1017] text-xs text-slate-400">
            <span>Нажмите на фильм, чтобы открыть страницу с описанием и советами</span>
            <button
              onClick={() => {
                const random = watchlist[Math.floor(Math.random() * watchlist.length)];
                onSelectMovie(random);
                onClose();
              }}
              className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
            >
              Выбрать фильм наугад из списка →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
