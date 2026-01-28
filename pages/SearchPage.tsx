import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Starter } from '../types';
import { StarterCard } from '../components/StarterCard';
import { Icon } from '../components/Icon';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Starter[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doSearch = async () => {
      setLoading(true);
      const all = await DataService.getAllStarters();
      const filtered = all.filter(s => 
        s.text.toLowerCase().includes(query.toLowerCase()) || 
        s.category.toLowerCase().includes(query.toLowerCase()) ||
        s.focus.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    };
    if (query) doSearch();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-sm text-muted hover:text-primary mb-4 transition-colors">
          <Icon name="ArrowRight" className="rotate-180 mr-1" size={16} />
          Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-main">
            Search results for "<span className="text-primary">{query}</span>"
        </h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((starter) => (
                <StarterCard key={starter.id} starter={starter} />
                ))}
            </div>
            
            {results.length === 0 && (
                <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                    <Icon name="Search" className="mx-auto text-muted mb-4" size={48} />
                    <p className="text-muted text-lg">No conversation starters matched your search.</p>
                    <Link to="/" className="text-primary font-medium hover:underline mt-2 inline-block">Browse all categories</Link>
                </div>
            )}
        </>
      )}
    </div>
  );
};