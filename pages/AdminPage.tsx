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
      <div className="max-w-md mx-auto py-32 px-4 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Monitor" size={32} className="text-muted" />
        </div>
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-muted mb-8">Please log in with your OIDC credentials to access the moderation dashboard.</p>
        <button 
          onClick={() => { login(); navigate('/admin'); }}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          Login to Dashboard
        </button>
      </div>
    );
  }

  if (loading) return <div className="py-20 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-main">Moderation Queue</h1>
          <p className="text-muted">{pending.length} submissions waiting review</p>
        </div>
        <button onClick={fetchPending} className="p-2 rounded-full hover:bg-border transition-colors">
          <Icon name="Shuffle" size={20} />
        </button>
      </div>

      {pending.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border">
          <Icon name="Target" className="mx-auto text-muted mb-4 opacity-20" size={64} />
          <p className="text-muted text-lg">Inbox Zero! No pending submissions.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pending.map(item => (
            <div key={item.id} className="bg-card border border-border p-6 rounded-2xl shadow-sm transition-all">
              {editingId === item.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1">Question Text</label>
                    <textarea 
                      className="w-full p-3 rounded-xl bg-canvas border border-border text-main text-lg italic"
                      value={editForm.text}
                      onChange={(e) => setEditForm({...editForm, text: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-muted mb-1">Category</label>
                      <input 
                        className="w-full p-2 rounded-lg bg-canvas border border-border text-xs"
                        value={editForm.category}
                        onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-muted mb-1">Type</label>
                      <input 
                        className="w-full p-2 rounded-lg bg-canvas border border-border text-xs"
                        value={editForm.questionType}
                        onChange={(e) => setEditForm({...editForm, questionType: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-muted mb-1">Focus Area</label>
                      <input 
                        className="w-full p-2 rounded-lg bg-canvas border border-border text-xs"
                        value={editForm.focus}
                        onChange={(e) => setEditForm({...editForm, focus: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <button 
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 text-muted font-bold hover:bg-canvas rounded-lg text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        // In a real app, update state/API here. For mock, we'll just 'save' locally in this view.
                        const updated = pending.map(p => p.id === item.id ? { ...p, ...editForm } as Starter : p);
                        setPending(updated);
                        setEditingId(null);
                      }}
                      className="px-4 py-2 bg-primary text-white font-bold rounded-lg text-sm"
                    >
                      Apply Changes
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase">{item.category}</span>
                      <span className="px-3 py-1 bg-muted/10 text-muted rounded-full text-xs font-bold uppercase">{item.questionType}</span>
                    </div>
                    <button 
                      onClick={() => handleStartEdit(item)}
                      className="p-2 text-muted hover:text-primary hover:bg-canvas rounded-full transition-all"
                      title="Edit Fields"
                    >
                      <Icon name="Sparkles" size={16} />
                    </button>
                  </div>
                  <p className="text-xl font-medium italic text-main mb-6">"{item.text}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted uppercase font-bold tracking-widest">{item.focus}</span>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleModerate(item.id, 'reject')}
                        className="flex items-center gap-2 px-4 py-2 text-rose-500 font-bold hover:bg-rose-50 rounded-full transition-colors"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => handleModerate(item.id, 'approve')}
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};