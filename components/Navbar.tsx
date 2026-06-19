import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Theme } from '../types';
import { DataService } from '../services/dataService';

const themes: { id: Theme; label: string; icon: string }[] = [
  { id: 'light', label: 'Light', icon: 'Sun' },
  { id: 'dark', label: 'Dark', icon: 'Moon' },
  { id: 'nord', label: 'Nord', icon: 'Monitor' },
  { id: 'dracula', label: 'Dracula', icon: 'Sparkles' },
];

interface DockProps {
  isActive: (path: string) => boolean;
  handleAdminClick: () => void;
  isAuthenticated: boolean;
  pendingCount: number;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isThemeMenuOpen: boolean;
  setIsThemeMenuOpen: (open: boolean) => void;
  themeMenuRef: React.RefObject<HTMLDivElement | null>;
}

const DesktopDock: React.FC<DockProps> = ({
  isActive, handleAdminClick, isAuthenticated, pendingCount,
  theme, setTheme, isThemeMenuOpen, setIsThemeMenuOpen, themeMenuRef
}) => (
  <div className="hidden md:flex fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
    <div className={`
      w-full rounded-full pl-3 pr-3 py-3 flex items-center justify-between
      shadow-[0_8px_40px_-12px_rgba(0,0,0,0.3)] backdrop-blur-2xl
      bg-slate-900/90 text-slate-100 border border-white/10
      dark:bg-white/90 dark:text-slate-900 dark:border-white/50
    `}>

      <Link to="/" className="flex items-center gap-3 group pl-2 pr-6">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-primary via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
          <Icon name="MessageCircle" size={22} className="fill-white/20" />
          <div className="absolute top-0 right-0 w-3 h-3 bg-teal-400 rounded-full border-2 border-slate-900 dark:border-white animate-pulse" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-extrabold text-xl tracking-tight text-white dark:text-slate-900">
            Talk<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 dark:from-rose-500 dark:to-orange-600">Spark</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest opacity-60 font-semibold pl-px">Conversation</span>
        </div>
      </Link>

      <div className="flex items-center p-1.5 bg-black/20 dark:bg-slate-200/50 rounded-lg border border-white/5 dark:border-black/5 backdrop-blur-sm">
        <Link to="/" className={`px-5 py-2 rounded-md text-sm font-bold transition-all duration-300 ${isActive('/') ? 'bg-primary text-white -translate-y-px' : 'text-slate-400 hover:bg-primary/10 hover:text-slate-500 dark:hover:text-slate-400'}`}>Explore</Link>
        <Link to="/random" className={`px-5 py-2 rounded-md text-sm font-bold transition-all duration-300 ${isActive('/random') ? 'bg-primary text-white -translate-y-px' : 'text-slate-400 hover:bg-primary/10 hover:text-slate-500 dark:hover:text-slate-400'}`}>Random</Link>
        <Link to="/submit" className={`px-5 py-2 rounded-md text-sm font-bold transition-all duration-300 ${isActive('/submit') ? 'bg-primary text-white -translate-y-px' : 'text-slate-400 hover:bg-primary/10 hover:text-slate-500 dark:hover:text-slate-400'}`}>Submit</Link>
      </div>

      <div className="flex items-center gap-1 pl-4">
         <button
           onClick={handleAdminClick}
           className="relative p-2 transition-all duration-300 hover:bg-primary/10 hover:text-primary"
           title={isAuthenticated ? "Admin Panel" : "Admin Login"}
         >
           <Icon name={isAuthenticated ? "Target" : "Monitor"} size={20} className="{isAuthenticated ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}" />
           {pendingCount > 0 && isAuthenticated && (
             <span className="absolute top-0 right-0 flex h-4 w-4">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] text-white items-center justify-center font-bold">{pendingCount}</span>
             </span>
           )}
         </button>
         <div className="relative" ref={themeMenuRef}>
            <button onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} className="w-10 h-10 flex items-center justify-center rounded-md transition-all duration-300 hover:bg-primary/10 hover:text-primary">
              <Icon name={themes.find(t => t.id === theme)?.icon || 'Sun'} size={20} className="text-slate-400 dark:text-slate-500" />
            </button>
            {isThemeMenuOpen && (
              <div className="absolute top-full right-0 mt-4 w-48 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 text-slate-200 shadow-2xl py-2 z-50 overflow-hidden">
                <div className="px-4 py-2 text-xs font-bold text-slate-500 uppercase">Theme</div>
                {themes.map((t) => (
                  <button key={t.id} onClick={() => { setTheme(t.id); setIsThemeMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm flex items-center space-x-3 hover:bg-white/5 ${theme === t.id ? 'text-indigo-400 font-bold' : ''}`}>
                    <Icon name={t.icon} size={16} />
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            )}
         </div>
      </div>
    </div>
  </div>
);

interface MobileNavProps {
  isActive: (path: string) => boolean;
  handleAdminClick: () => void;
  isAuthenticated: boolean;
}

const MobileNavItem: React.FC<{ to: string; icon: string; label: string; active: boolean }> = ({ to, icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center justify-center transition-all duration-300 ${active ? 'text-primary -translate-y-px' : 'text-slate-400 dark:text-slate-500 hover:bg-primary/10 hover:text-primary'}`}>
    <Icon name={icon} size={24} className={`${active ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`} />
    <span className={`text-[10px] font-medium mt-1`}>{label}</span>
  </Link>
);

const MobileBottomNav: React.FC<MobileNavProps> = ({ isActive, handleAdminClick, isAuthenticated }) => (
  <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] z-50">
    <div className="bg-slate-900/90 dark:bg-white/90 backdrop-blur-xl border border-white/10 dark:border-black/5 shadow-2xl rounded-full flex justify-around items-center px-4 py-4">
      <MobileNavItem to="/" icon="Home" label="Home" active={isActive('/')} />
      <MobileNavItem to="/random" icon="Shuffle" label="Random" active={isActive('/random')} />
      <MobileNavItem to="/submit" icon="Sparkles" label="Submit" active={isActive('/submit')} />
      <button onClick={handleAdminClick} className="flex flex-col items-center justify-center transition-all duration-300 ${isActive('/admin') ? 'text-primary -translate-y-px' : 'text-slate-400 dark:text-slate-500 hover:bg-primary/10 hover:text-primary'}">
        <Icon name={isAuthenticated ? "Target" : "Monitor"} size={24} className="${isActive('/admin') ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}" />
        <span className="text-[10px] font-medium mt-1">{isAuthenticated ? 'Admin' : 'Admin Login'}</span>
      </button>
    </div>
  </div>
);

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, login } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  const updatePendingCount = async () => {
    const pending = await DataService.getPendingStarters();
    setPendingCount(pending.length);
  };

  useEffect(() => {
    updatePendingCount();
    window.addEventListener('talkspark-data-update', updatePendingCount);
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('talkspark-data-update', updatePendingCount);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      login();
      navigate('/admin');
    }
  };

  return (
    <>
      <DesktopDock
        isActive={isActive}
        handleAdminClick={handleAdminClick}
        isAuthenticated={isAuthenticated}
        pendingCount={pendingCount}
        theme={theme}
        setTheme={setTheme}
        isThemeMenuOpen={isThemeMenuOpen}
        setIsThemeMenuOpen={setIsThemeMenuOpen}
        themeMenuRef={themeMenuRef}
      />
      <MobileBottomNav
        isActive={isActive}
        handleAdminClick={handleAdminClick}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
};
