import React, { useState } from 'react';
import { Starter } from '../types';
import { getCategoryClasses, CATEGORY_ICONS } from '../constants';
import { Icon } from './Icon';

interface Props {
  starter: Starter;
  onClick?: () => void;
  featured?: boolean;
}

export const StarterCard: React.FC<Props> = ({ starter, onClick, featured = false }) => {
  const { badge: badgeClass } = getCategoryClasses(starter.category);
  const iconName = CATEGORY_ICONS[starter.category] || "MessageCircle";
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(starter.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TalkSpark',
          text: `"${starter.text}" - A conversation starter from TalkSpark`,
          url: window.location.href
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback to copy if web share not supported
      handleCopy(e);
    }
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative group bg-card rounded-2xl border border-border
        shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
        hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1
        transition-all duration-300 ease-out cursor-pointer overflow-hidden
        flex flex-col
        ${featured ? 'p-8 md:p-12' : 'p-6'}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeClass}
        `}>
          <Icon name={iconName} size={12} />
          {starter.category.replace(/[^a-zA-Z\s&]/g, '').trim()}
        </span>
        
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="text-slate-400 dark:text-slate-500 hover:bg-primary/10 hover:text-primary active:bg-primary/20 active:-translate-y-px transition-all duration-200 px-5 py-2 rounded-md"
            title="Share"
          >
            <Icon name="Share2" size={16} />
          </button>
          
          <button
            onClick={handleCopy}
            className="text-slate-400 dark:text-slate-500 hover:bg-primary/10 hover:text-primary active:bg-primary/20 active:-translate-y-px transition-all duration-200 px-5 py-2 rounded-md"
            title="Copy to clipboard"
          >
            {copied ? (
              <span className="text-xs text-emerald-600 font-medium">Copied!</span>
            ) : (
              <Icon name="Copy" size={16} />
            )}
          </button>
        </div>
      </div>

      <h3 className={`text-main leading-snug text-center italic ${featured ? 'text-3xl md:text-5xl font-semibold my-6 px-4' : 'text-xl font-medium my-2'}`}>
        "{starter.text}"
      </h3>

      <div className="mt-auto pt-4 flex items-center justify-between text-xs text-muted font-medium uppercase tracking-wider">
        <span>{starter.focus}</span>
        {featured && (
          <span className="flex items-center gap-1 text-primary float-animation">
            <Icon name="Sparkles" size={14} />
            Featured
          </span>
        )}
      </div>
    </div>
  );
};