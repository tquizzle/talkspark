import React, { useEffect, useState, useRef } from 'react';
import { DataService } from '../services/dataService';
import { Starter } from '../types';
import { StarterCard } from '../components/StarterCard';
import { Icon } from '../components/Icon';

export const RandomPage: React.FC = () => {
  const [starter, setStarter] = useState<Starter | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Animation state: 'idle' | 'exiting' | 'entering'
  // We use CSS classes to handle the transitions based on this state
  const [animState, setAnimState] = useState<'idle' | 'exiting' | 'entering'>('idle');

  // Load initial starter
  useEffect(() => {
    const init = async () => {
      const data = await DataService.getRandomStarter();
      setStarter(data);
      setLoading(false);
    };
    init();
  }, []);

  const handleShuffle = async () => {
    if (animState !== 'idle') return;

    // 1. Trigger Exit Animation (Throw card to the left)
    setAnimState('exiting');
    
    // Wait for exit animation to complete (approx 300ms matches CSS)
    await new Promise(r => setTimeout(r, 300));

    // 2. Fetch new data while card is off-screen
    // (In a real app with network latency, we might show a loader here, 
    // but for the visual shuffle effect, we want it snappy)
    const newStarter = await DataService.getRandomStarter();
    setStarter(newStarter);

    // 3. Prepare Entry (Position card to the right instantly)
    setAnimState('entering');
    
    // Force a reflow/repaint so the browser registers the 'entering' start position
    // before we transition back to 'idle'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 4. Trigger Enter Animation (Slide in to center)
        setAnimState('idle');
      });
    });
  };

  // CSS classes for the card container based on state
  const getCardTransformClass = () => {
    switch (animState) {
      case 'exiting':
        return 'translate-x-[-120%] -rotate-12 opacity-0';
      case 'entering':
        return 'translate-x-[120%] rotate-12 opacity-0 transition-none'; // No transition for instant reset
      case 'idle':
        return 'translate-x-0 rotate-0 opacity-100';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-main mb-3">Shuffle the Deck</h1>
        <p className="text-muted text-lg">Swipe through deep questions to find the perfect spark.</p>
      </div>

      <div className="relative w-full max-w-2xl h-96 flex items-center justify-center">
        {loading ? (
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        ) : (
          <>
            {/* Background Stack (Decorative cards to create depth) */}
            <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                 <div className="w-[98%] h-full absolute bg-card/40 border border-border rounded-2xl transform rotate-[-2deg] scale-[0.98] -z-10 shadow-sm"></div>
                 <div className="w-[96%] h-full absolute bg-card/20 border border-border rounded-2xl transform rotate-[2deg] scale-[0.96] -z-20 shadow-sm"></div>
            </div>

            {/* Active Card Container */}
            <div className={`
                w-full transform transition-all duration-500 ease-out cubic-bezier(0.34, 1.56, 0.64, 1)
                ${getCardTransformClass()}
            `}>
              {starter && <StarterCard starter={starter} featured={true} />}
            </div>
          </>
        )}
      </div>

      <div className="mt-16">
        <button
            onClick={handleShuffle}
            disabled={animState !== 'idle' || loading}
            className={`
                group relative inline-flex items-center justify-center px-12 py-5 
                text-xl font-bold text-white rounded-full 
                shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] 
                transition-all duration-300
                ${animState !== 'idle' ? 'scale-95 bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-rose-600 hover:shadow-[0_20px_40px_-10px_rgba(225,29,72,0.5)] hover:-translate-y-1 active:scale-95'}
            `}
        >
            <div className={`mr-3 transition-transform duration-500 ${animState !== 'idle' ? '-rotate-180' : 'group-hover:rotate-12'}`}>
                <Icon name="Shuffle" size={28} />
            </div>
            {animState !== 'idle' ? "Shuffling..." : "Shuffle Card"}
            
            {/* Button Glint */}
            {animState === 'idle' && (
                <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                </div>
            )}
        </button>
      </div>
      
      <style>{`
        @keyframes shimmer {
            100% {
                transform: translateX(100%);
            }
        }
      `}</style>
    </div>
  );
};