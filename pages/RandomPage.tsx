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
          return 'translate-x-[-100%] -rotate-10 opacity-0';
        case 'entering':
          return 'translate-x-[100%] rotate-10 opacity-0 transition-none'; // No transition for instant reset
        case 'idle':
          return 'translate-x-0 rotate-0 opacity-100';
        default:
          return '';
      }
    };

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold text-main tracking-tight mb-4">Shuffle the Deck</h1>
          <p className="text-lg text-muted max-w-xl">Swipe through deep questions to find the perfect spark.</p>
        </div>

        <div className="relative w-full max-w-3xl h-[72vh] flex items-center justify-center">
          {loading ? (
               <div className="animate-pulse rounded-full h-16 w-16 bg-primary/20"></div>
          ) : (
            <>
              {/* Background Stack (Decorative cards to create depth) */}
              <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                   <div className="w-[96%] h-full absolute bg-card/30 border border-border/50 rounded-2xl transform rotate-[-1deg] scale-[0.94] -z-20"></div>
                   <div className="w-[92%] h-full absolute bg-card/20 border border-border/50 rounded-2xl transform rotate-[2deg] scale-[0.88] -z-40"></div>
              </div>

              {/* Active Card Container */}
              <div
                className={`
                  w-full transform transition-all duration-500
                  ${getCardTransformClass()}
                `}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              >
                {starter && <StarterCard starter={starter} featured={true} className="float-animation" />}
              </div>
            </>
          )}
        </div>

        <div className="mt-12">
          <button
              onClick={handleShuffle}
              disabled={animState !== 'idle' || loading}
              className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary active:bg-primary/20 active:-translate-y-px ${animState !== 'idle' ? 'opacity-50 pointer-events-none' : ''}"
          >
              <div className="mr-3 h-5 w-5 flex items-center justify-center">
                <Icon name="Shuffle" size={20} className={`transition-transform duration-500 ${animState !== 'idle' ? '-rotate-180' : 'group-hover:rotate-12'}`} />
              </div>
              <span>{animState !== 'idle' ? "Shuffling..." : "Shuffle Card"}</span>
          </button>
        </div>
      </div>
    );
  };