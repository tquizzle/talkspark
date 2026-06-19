import React, { useEffect, useState } from 'react';
  import { DataService } from '../services/dataService';
  import { CategoryStats, Starter } from '../types';
  import { getCategoryClasses, CATEGORY_ICONS } from '../constants';
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
          <div className="animate-pulse rounded-full h-12 w-12 bg-primary/20"></div>
        </div>
      );
    }

    return (
      <div className="pb-20">
        {/* Hero Section - Left-aligned per DESIGN.md */}
        <section className="relative bg-card border-b border-border overflow-hidden transition-colors duration-300">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-rose-500/5 -z-10"></div>
          <div className="relative max-w-5xl mx-auto px-4 py-12 sm:py-16">
            {/* Asymmetric header layout */}
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-main tracking-tight mb-4">
                  Spark Better <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-500">Conversations</span>
                </h1>
                <p className="text-base text-muted mb-6 max-w-xl">
                  Discover hundreds of thought-provoking questions to deepen relationships, break the ice, and explore new perspectives.
                </p>

                {/* Search form with label above input */}
                <form onSubmit={handleSearch} className="space-y-4 w-full max-w-xl">
                  <label className="text-sm font-medium text-main dark:text-slate-400">
                    Search topics, questions...
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icon name="Search" className="text-muted group-focus-within:text-primary transition-colors" size={20} />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-4 py-3 bg-canvas border border-border rounded-lg text-main placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all duration-200 active:-translate-y-px"
                    >
                      <Icon name="ArrowRight" size={18} className="text-white" />
                    </button>
                  </div>
                </form>

                <div className="mt-4 flex items-center gap-4">
                  <button
                     onClick={() => navigate('/random')}
                     className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-primary/10 hover:text-primary active:bg-primary/20 active:-translate-y-px"
                  >
                    <Icon name="Shuffle" size={18} className="mr-2" />
                    Random Starter
                  </button>
                </div>
              </div>
              {/* Optional decorative element or empty space for asymmetry */}
              <div className="hidden sm:block">
                {/* Could add decorative element here for asymmetry */}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
           {/* Featured Card */}
           {featured && (
              <div className="mb-12">
                <StarterCard starter={featured} featured={true} onClick={() => navigate('/random')} />
              </div>
           )}

           {/* Categories Grid */}
           <div className="mb-10">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-main">Explore by Category</h2>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {categories.map((cat, index) => {
                 const iconName = CATEGORY_ICONS[cat.name];
                 const { iconBg: iconBgClass } = getCategoryClasses(cat.name);

                 // Staggered animation delay
                 const animationDelay = index * 50;

                 return (
                   <div
                     key={cat.name}
                     onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                     className="group relative bg-card rounded-2xl p-6 border border-border/50 hover:border-border hover:bg-canvas/50 transition-all duration-300 cursor-pointer"
                     style={{ animationDelay: `${animationDelay}ms` }}
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