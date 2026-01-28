import React, { useEffect, useState } from 'react';
import { DataService } from '../services/dataService';
import { CategoryStats, Starter } from '../types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';
import { Icon } from '../components/Icon';
import { StarterCard } from '../components/StarterCard';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryStats[]>([]);
  const [featured, setFeatured] = useState<Starter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [cats, random] = await Promise.all([
        DataService.getCategories(),
        DataService.getRandomStarter()
      ]);
      setCategories(cats);
      setFeatured(random);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative bg-card border-b border-border overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-rose-500/5 -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-main tracking-tight mb-6">
            Spark Better <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500">Conversations</span>
          </h1>
          <p className="text-lg text-muted mb-10 max-w-2xl mx-auto">
            Discover hundreds of thought-provoking questions to deepen relationships, break the ice, and explore new perspectives.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="Search" className="text-muted group-focus-within:text-primary transition-colors" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search topics, questions..."
              className="block w-full pl-11 pr-4 py-4 bg-canvas border border-border rounded-full text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-lg shadow-primary/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
            >
              <Icon name="ArrowRight" size={18} />
            </button>
          </form>

          <div className="mt-8 flex justify-center gap-4">
            <button 
               onClick={() => navigate('/random')}
               className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
            >
              <Icon name="Shuffle" className="mr-2" size={18} />
              Random Starter
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
         {/* Featured Card */}
         {featured && (
            <div className="mb-16 transform transition-all hover:scale-[1.01]">
              <StarterCard starter={featured} featured={true} onClick={() => navigate('/random')} />
            </div>
         )}

        {/* Categories Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-main">Explore by Category</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const baseColor = CATEGORY_COLORS[cat.name] || 'gray';
              const iconName = CATEGORY_ICONS[cat.name];
              const iconBgClass = `bg-${baseColor}-500/10 text-${baseColor}-600 dark:text-${baseColor}-400`;
              
              return (
                <div 
                  key={cat.name}
                  onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                  className="group relative bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBgClass}`}>
                    <Icon name={iconName} size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-main mb-1 group-hover:text-primary transition-colors">
                    {cat.name.replace(/[^a-zA-Z\s&]/g, '').trim()}
                  </h3>
                  <p className="text-sm text-muted">
                    {cat.count} starters
                  </p>
                  
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <Icon name="ArrowRight" className="text-muted" size={20} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};