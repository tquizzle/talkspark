
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { RandomPage } from './pages/RandomPage';
import { SearchPage } from './pages/SearchPage';
import { SubmitPage } from './pages/SubmitPage';
import { AdminPage } from './pages/AdminPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { Icon } from './components/Icon';

const AccessibilityModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="accessibility-title"
      >
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-canvas/50">
          <div className="flex items-center gap-2 text-primary">
            <Icon name="Info" size={18} />
            <h2 id="accessibility-title" className="font-bold text-main">Accessibility Notes</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-border rounded-full text-muted transition-colors"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="p-8">
          <p className="text-main leading-relaxed mb-4">
            TalkSpark is built with inclusive design principles at its core. We prioritize readability and ease of use for everyone.
          </p>
          <ul className="space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span><strong>High Contrast:</strong> Thoughtfully selected colors ensuring clear separation between text and backgrounds.</span>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span><strong>Typography:</strong> We use the low-vision friendly <a href="https://brailleinstitute.org/freefont" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold transition-colors">Atkinson Hyperlegible Next</a> font developed by the Braille Institute.</span>
            </li>
            <li className="flex gap-3">
              <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary"></div>
              <span><strong>UI Patterns:</strong> Large hit areas and clear visual feedback for a frustration-free experience.</span>
            </li>
          </ul>
        </div>
        <div className="px-6 py-4 bg-canvas/30 border-t border-border flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-primary text-white font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

const Footer: React.FC<{ onOpenAccessibility: () => void }> = ({ onOpenAccessibility }) => (
  <footer className="bg-card border-t border-border py-12 mt-auto transition-colors duration-300 mb-20 md:mb-0">
    <div className="max-w-6xl mx-auto px-4 text-center">
      <p className="text-muted text-sm mb-3">
        © {new Date().getFullYear()} TalkSpark. Designed by TQ to bring people closer.
      </p>
      <button 
        onClick={onOpenAccessibility}
        className="inline-flex items-center gap-1.5 text-xs text-primary/80 hover:text-primary transition-colors font-medium underline decoration-dotted"
      >
        <Icon name="Info" size={12} />
        Accessibility Notes
      </button>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-canvas text-main font-sans transition-colors duration-300">
            <Navbar />
            <main className="flex-grow pt-24 pb-24 md:pb-0 md:pt-32">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/random" element={<RandomPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/submit" element={<SubmitPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
            <Footer onOpenAccessibility={() => setIsAccessibilityOpen(true)} />
            <AccessibilityModal 
              isOpen={isAccessibilityOpen} 
              onClose={() => setIsAccessibilityOpen(false)} 
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
