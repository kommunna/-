import React from 'react';
import { Bookmark, Dices, Film } from 'lucide-react';

interface NavbarProps {
  currentView: 'catalog' | 'detail';
  onNavigateHome: () => void;
  onOpenRoulette: () => void;
  onOpenWatchlist: () => void;
  onScrollToFinder: () => void;
  watchlistCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateHome,
  onOpenRoulette,
  onOpenWatchlist,
  onScrollToFinder,
  watchlistCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0c0d12]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-left cursor-pointer"
          aria-label="ВЕЧЕРФИЛЬМ главная"
        >
          <div className="flex items-center justify-center text-amber-400">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-wider text-white font-cinematic">
            ВЕЧЕРФИЛЬМ
          </span>
        </button>

        {/* Zone 2: 3-4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={onNavigateHome}
            className={`transition-colors cursor-pointer hover:text-white ${currentView === 'catalog' ? 'text-amber-400 font-semibold' : ''}`}
          >
            Каталог
          </button>
          <button
            onClick={() => {
              if (currentView !== 'catalog') onNavigateHome();
              setTimeout(onScrollToFinder, 50);
            }}
            className="hover:text-amber-400 transition-colors cursor-pointer"
          >
            Подбор по настроению
          </button>
          <button
            onClick={onOpenRoulette}
            className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Dices className="w-3.5 h-3.5 text-amber-400" />
            <span>Рулетка</span>
          </button>
        </nav>

        {/* Zone 3: Primary action (Закладки) */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenWatchlist}
            className="relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-500/20 transition-all cursor-pointer font-semibold"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Закладки</span>
            {watchlistCount > 0 && (
              <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-stone-950 text-amber-400 tabular-nums">
                {watchlistCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
