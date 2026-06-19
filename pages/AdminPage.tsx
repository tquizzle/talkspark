import React, { useEffect, useState } from 'react';
  import { DataService } from '../services/dataService';
  import { Starter } from '../types';
  import { Icon } from '../components/Icon';
  import { useAuth } from '../contexts/AuthContext';
  import { useNavigate } from 'react-router-dom';

  export const AdminPage: React.FC = () => {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const [pending, setPending] = useState<Starter[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<Starter>>({});

    useEffect(() => {
      if (!isAuthenticated) {
        // Simulate that clicking admin without auth just prompts login
        // but if they hit the URL directly, we show a login gate
        return;
      }
      fetchPending();
    }, [isAuthenticated]);

    const fetchPending = async () => {
      setLoading(true);
      const data = await DataService.getPendingStarters();
      setPending(data);
      setLoading(false);
    };

    const handleStartEdit = (item: Starter) => {
      setEditingId(item.id);
      setEditForm({
        category: item.category,
        questionType: item.questionType,
        focus: item.focus,
        text: item.text
      });
    };

    const handleModerate = async (id: number, action: 'approve' | 'reject') => {
      try {
        // If we are currently editing this ID and approving,
        // we'd technically want to save the changes too.
        // For this mock, we'll assume approval uses the current editForm if it matches the ID
        await DataService.moderateStarter(id, action);
        setPending(prev => prev.filter(p => p.id !== id));
        if (editingId === id) setEditingId(null);
      } catch (e) {
        alert("Action failed");
      }
    };

    if (!isAuthenticated) {
      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-20 h-20 bg-canvas/50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-8">
            <Icon name="Monitor" size={40} className="text-muted dark:text-slate-400" />
          </div>
          <h1 className="text-5xl font-bold text-main tracking-tight mb-6">Admin Access Required</h1>
          <p className="text-lg text-muted mb-10 max-w-xl">
            Please log in with your OIDC credentials to access the moderation dashboard.
          </p>
          <button
            onClick={() => { login(); navigate('/admin'); }}
            className="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/10 active:bg-primary/20 transition-all duration-200"
          >
            Login to Dashboard
          </button>
        </div>
      );
    }

    if (loading) return <div className="py-24 text-center"><div className="animate-pulse rounded-full h-16 w-16 bg-primary/20 mx-auto"></div></div>;

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold text-main tracking-tight mb-4">Moderation Queue</h1>
            <p className="text-lg text-muted max-w-xl">{pending.length} submissions waiting review</p>
          </div>
          <button onClick={fetchPending} className="p-4 rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary">
            <Icon name="RefreshCw" size={24} className="mr-2" />
            Refresh Queue
          </button>
        </div>

        {pending.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border border-border/50">
            <Icon name="Target" className="mx-auto text-muted mb-6" size={48} />
            <p className="text-base text-muted">Inbox Zero! No pending submissions.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {pending.map(item => (
              <div key={item.id} className="bg-card rounded-2xl border border-border/50 p-8 transition-all duration-200 hover:border-border hover:bg-canvas/50">
                {editingId === item.id ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-main dark:text-slate-400 mb-2">Question Text</label>
                      <textarea
                        className="w-full px-5 py-4 rounded-lg bg-canvas border border-border focus:ring-2 focus-ring-primary/20 focus:border-primary text-main placeholder-muted outline-none"
                        value={editForm.text}
                        onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                        min-h="120"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-main dark:text-slate-400 mb-2">Category</label
                        >input
                          className="w-full px-5 py-4 rounded-lg bg-canvas border border-border focus:ring-2 focus-ring-primary/20 focus:border-primary text-main placeholder-muted outline-none"
                          value={editForm.category}
                          onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-main dark:text-slate-400 mb-2">Type</label>
                        <input
                          className="w-full px-5 py-4 rounded-lg bg-canvas border border-border focus:ring-2 focus-ring-primary/20 focus:border-primary text-main placeholder-muted outline-none"
                          value={editForm.questionType}
                          onChange={(e) => setEditForm({...editForm, questionType: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-main dark:text-slate-400 mb-2">Focus Area</label>
                        <input
                          className="w-full px-5 py-4 rounded-lg bg-canvas border border-border focus:ring-2 focus-ring-primary/20 focus:border-primary text-main placeholder-muted outline-none"
                          value={editForm.focus}
                          onChange={(e) => setEditForm({...editForm, focus: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-3 rounded-lg font-medium text-muted hover:bg-canvas/50 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          const updated = pending.map(p => p.id === item.id ? { ...p, ...editForm } as Starter : p);
                          setPending(updated);
                          DataService.updatePendingStarter(item.id, editForm);
                          setEditingId(null);
                        }}
                        className="px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/10 active:bg-primary/20 transition-all duration-200"
                      >
                        Apply Changes
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-wrap gap-4">
                          <span className="inline-flex items-center px-4 py-2 rounded-lg text-primary/70 bg-primary/20 text-xs font-medium">{item.category}</span>
                          <span className="inline-flex items-center px-4 py-2 rounded-lg text-muted/70 bg-muted/20 text-xs font-medium">{item.questionType}</span>
                        </div>
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-4 rounded-lg text-muted hover:text-primary hover:bg-canvas/50 transition-all duration-200"
                          title="Edit Fields"
                        >
                          <Icon name="Sparkles" size={24} />
                        </button>
                        <p className="text-xl font-medium italic text-main mb-8">"{item.text}"</p>
                        <div className="flex items-center justify-between pt-6 border-t border-border/50">
                          <span className="text-sm font-medium text-muted dark:text-slate-400">{item.focus}</span>
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleModerate(item.id, 'reject')}
                              className="flex items-center gap-4 px-5 py-3 rounded-lg text-rose-500 font-medium hover:bg-rose-50/10 transition-all duration-200"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleModerate(item.id, 'approve')}
                              className="flex items-center gap-4 px-5 py-3 bg-emerald-500 text-white font-medium rounded-lg hover:bg-emerald-600 transition-all duration-200"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              )}
            )}
          </div>
        )}
      </div>
    );
  };