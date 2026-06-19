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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Icon name="Sparkles" size={48} />
          </div>
          <h1 className="text-5xl font-bold text-main tracking-tight mb-6">Submission Sent!</h1>
          <p className="text-lg text-muted mb-10 max-w-xl">
            Thanks for helping TalkSpark grow. Your question is now in the moderation queue and will be live once approved.
          </p>
          <div className="flex justify-center gap-6 mt-8">
            <button
              onClick={() => { setSubmitted(false); setFormData({ text: '', category: '', questionType: '', focus: '' }); }}
              className="px-8 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/10 active:bg-primary/20 transition-all duration-200"
            >
              Submit Another
            </button>
            <Link to="/" className="px-8 py-4 bg-canvas border border-border/50 text-main rounded-lg font-bold hover:text-primary/70 hover:text-primary transition-colors duration-200">
              Back Home
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-main tracking-tight mb-6">Suggest a Starter</h1>
          <p className="text-lg text-muted max-w-xl">Contribute to the collective wisdom of TalkSpark.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-card p-10 rounded-2xl border border-border/50 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]">
          <div>
            <label className="block text-sm font-medium text-main dark:text-slate-400 mb-3">The Question</label>
            <textarea
              required
              placeholder="e.g. If you could have dinner with anyone from history, who would it be?"
              className="w-full px-5 py-4 rounded-lg bg-canvas border border-border focus:ring-2 focus-ring-primary/20 focus:border-primary text-main placeholder-muted outline-none min-h-[140px] resize-none"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-main dark:text-slate-400 mb-3">Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Philosophy"
                className="w-full px-5 py-4 rounded-lg bg-canvas border border-border focus:ring-2 focus-ring-primary/20 focus:border-primary text-main placeholder-muted outline-none"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-main dark:text-slate-400 mb-3">Question Type</label>
              <input
                type="text"
                required
                placeholder="e.g. Hypothetical"
                className="w-full px-5 py-4 rounded-lg bg-canvas border border-border focus:ring-2 focus-ring-primary/20 focus:border-primary text-main placeholder-muted outline-none"
                value={formData.questionType}
                onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-main dark:text-slate-400 mb-3">Focus Area</label>
            <input
              type="text"
              required
              placeholder="e.g. Aspirations & Legacy"
              className="w-full px-5 py-4 rounded-lg bg-canvas border border-border focus:ring-2 focus-ring-primary/20 focus:border-primary text-main placeholder-muted outline-none"
              value={formData.focus}
              onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-4 rounded-lg font-medium text-white shadow-md transition-all duration-200 hover:bg-primary/10 active:bg-primary/20 ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}"
          >
            {isSubmitting ? 'Sending...' : 'Submit to Moderation'}
          </button>
        </form>
      </div>
    );
  };