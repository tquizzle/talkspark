import React, { useEffect, useState } from 'react';
  import { useParams, Link } from 'react-router-dom';
  import { DataService } from '../services/dataService';
  import { Starter } from '../types';
  import { StarterCard } from '../components/StarterCard';
  import { Icon } from '../components/Icon';
  import { getCategoryClasses, CATEGORY_ICONS } from '../constants';

  export const CategoryPage: React.FC = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const [starters, setStarters] = useState<Starter[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchStarters = async () => {
        setLoading(true);
        if (categoryName) {
          const data = await DataService.getStartersByCategory(categoryName);
          setStarters(data);
        }
        setLoading(false);
      };
      fetchStarters();
    }, [categoryName]);

    if (loading) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-pulse rounded-full h-8 w-8 bg-primary/20"></div>
        </div>
      );
    }

    const cleanName = categoryName?.replace(/[^a-zA-Z\s&]/g, '').trim() || 'Category';
    const iconName = categoryName && CATEGORY_ICONS[categoryName] ? CATEGORY_ICONS[categoryName] : "MessageCircle";
    const { iconBg: iconBgClass } = getCategoryClasses(categoryName || '');

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-primary/70 hover:text-primary mb-6 transition-colors duration-200">
            <Icon name="ArrowLeft" className="mr-2" size={18} />
            Back to Categories
          </Link>
          <div className="flex items-center gap-6">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${iconBgClass}`}>
                  <Icon name={iconName} size={28} />
              </div>
              <div>
                  <h1 className="text-4xl font-bold text-main tracking-tight">{cleanName}</h1>
                  <p className="text-base text-muted max-w-xl">{starters.length} conversation starters</p>
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {starters.map((starter, index) => (
            <StarterCard
              key={starter.id}
              starter={starter}
              className={`hover:translate-y-[-2px] delay-${index * 50}`}
              style={{ animationDelay: `${index * 50}ms` }}
            />
          ))}
        </div>

        {starters.length === 0 && (
          <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
              <p className="text-lg text-muted">No conversation starters found in this category yet.</p>
          </div>
        )}
      </div>
    );
  };