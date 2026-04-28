import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Plus, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useResearchQueue } from '../hooks/useResearchQueue';
import { PRIORITY_LABELS, PRIORITY_COLORS } from '../types';
import { cn } from '../lib/utils';

export const ResearchQueuePanel: React.FC = () => {
  const { items, loading, queueResearch } = useResearchQueue();
  const [topic, setTopic] = useState('');
  const [priority, setPriority] = useState('pri-med');
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setSubmitting(true);
    try {
      await queueResearch(topic.trim(), priority);
      setTopic('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-accent" />
          <span className="font-semibold text-sm text-foreground">Research Queue</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Add new topic form */}
              <form onSubmit={handleSubmit} className="space-y-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Queue a research topic..."
                  className="w-full bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                />
                <div className="flex gap-2">
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="flex-1 bg-input border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                  >
                    <option value="pri-high">High Priority</option>
                    <option value="pri-med">Medium Priority</option>
                    <option value="pri-low">Low Priority</option>
                  </select>
                  <button
                    type="submit"
                    disabled={submitting || !topic.trim()}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all',
                      'bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed'
                    )}
                  >
                    {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                    Queue
                  </button>
                </div>
              </form>

              {/* Items list */}
              {loading && items.length === 0 ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-10 rounded-xl bg-muted animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  <AnimatePresence>
                    {items.map((item) => {
                      const priColor = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS['pri-low'];
                      const priLabel = PRIORITY_LABELS[item.priority] || '';
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-2 p-2 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                        >
                          <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${priColor}`}>
                            {priLabel}
                          </span>
                          <span className="text-xs text-foreground truncate flex-1">{item.title}</span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {items.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      No topics queued yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
