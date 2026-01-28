import React, { useState } from 'react';
import { DataService } from '../services/dataService';
import { Icon } from '../components/Icon';
import { Link } from 'react-router-dom';

export const SubmitPage: React.FC = () => {
  const [formData, setFormData] = useState({
    text: '',
    category: '',
    questionType: '',
    focus: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await DataService.submitStarter(formData);
      setSubmitted(true);
    } catch (err) {
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="Sparkles" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-main mb-4">Submission Sent!</h1>
        <p className="text-muted mb-8 text-lg">
          Thanks for helping TalkSpark grow. Your question is now in the moderation queue and will be live once approved.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => { setSubmitted(false); setFormData({ text: '', category: '', questionType: '', focus: '' }); }}
            className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-opacity"
          >
            Submit Another
          </button>
          <Link to="/" className="px-6 py-3 bg-canvas border border-border text-main rounded-full font-bold hover:bg-border transition-colors">
            Back Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-main mb-3">Suggest a Starter</h1>
        <p className="text-muted">Contribute to the collective wisdom of TalkSpark.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-3xl border border-border shadow-xl">
        <div>
          <label className="block text-sm font-bold text-main mb-2">The Question</label>
          <textarea
            required
            placeholder="e.g. If you could have dinner with anyone from history, who would it be?"
            className="w-full px-4 py-3 rounded-2xl bg-canvas border border-border focus:ring-2 focus:ring-primary/20 outline-none text-main min-h-[120px]"
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-main mb-2">Category</label>
            <input
              type="text"
              required
              placeholder="e.g. Philosophy"
              className="w-full px-4 py-3 rounded-full bg-canvas border border-border focus:ring-2 focus:ring-primary/20 outline-none text-main"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-main mb-2">Question Type</label>
            <input
              type="text"
              required
              placeholder="e.g. Hypothetical"
              className="w-full px-4 py-3 rounded-full bg-canvas border border-border focus:ring-2 focus:ring-primary/20 outline-none text-main"
              value={formData.questionType}
              onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-main mb-2">Focus Area</label>
          <input
            type="text"
            required
            placeholder="e.g. Aspirations & Legacy"
            className="w-full px-4 py-3 rounded-full bg-canvas border border-border focus:ring-2 focus:ring-primary/20 outline-none text-main"
            value={formData.focus}
            onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 rounded-full font-bold text-white shadow-lg transition-all ${
            isSubmitting ? 'bg-muted cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-rose-600 hover:scale-[1.02] active:scale-95'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Submit to Moderation'}
        </button>
      </form>
    </div>
  );
};