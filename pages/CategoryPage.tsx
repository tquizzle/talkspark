import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Starter } from '../types';
import { StarterCard } from '../components/StarterCard';
import { Icon } from '../components/Icon';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../constants';

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const cleanName = categoryName?.replace(/[^a-zA-Z\s&]/g, '').trim() || 'Category';
  const baseColor = categoryName && CATEGORY_COLORS[categoryName] ? CATEGORY_COLORS[categoryName] : "gray";
  const iconName = categoryName && CATEGORY_ICONS[categoryName] ? CATEGORY_ICONS[categoryName] : "MessageCircle";
  const iconBgClass = `bg-${baseColor}-500/10 text-${baseColor}-600 dark:text-${baseColor}-400`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted hover:text-primary mb-4 transition-colors">
          <Icon name="ArrowRight" className="rotate-180 mr-1" size={16} />
          Back to Categories
        </Link>
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${iconBgClass}`}>
                <Icon name={iconName} size={32} />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-main">{cleanName}</h1>
                <p className="text-muted">{starters.length} conversation starters</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {starters.map((starter) => (
          <StarterCard key={starter.id} starter={starter} />
        ))}
      </div>
      
      {starters.length === 0 && (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
            <p className="text-muted">No conversation starters found in this category yet.</p>
        </div>
      )}
    </div>
  );
};