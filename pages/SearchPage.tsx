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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-primary/70 hover:text-primary mb-6 transition-colors duration-200">
            <Icon name="ArrowLeft" className="mr-2" size={18} />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-main tracking-tight mb-4">
              Search results for "<span className="text-primary">{query}</span>"
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
               <div className="animate-pulse rounded-full h-12 w-12 bg-primary/20"></div>
          </div>
        ) : (
          <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((starter, index) => (
                    <StarterCard
                      key={starter.id}
                      starter={starter}
                      className={`hover:translate-y-[-2px] delay-${index * 50}`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    />
                  ))}
              </div>

              {results.length === 0 && (
                <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
                    <Icon name="Search" className="mx-auto text-muted mb-6" size={40} />
                    <p className="text-base text-muted">No conversation starters matched your search.</p>
                    <Link to="/" className="text-primary font-medium hover:text-primary/70 hover:text-primary mt-4 inline-block transition-colors duration-200">Browse all categories</Link>
                </div>
              )}
          </>
        )}
      </div>
    );
  };