import * as React from 'react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, Brain, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { useKnowledgeBase } from './hooks/useKnowledgeBase';
import { KnowledgeCard } from './components/KnowledgeCard';
import { ResearchQueuePanel } from './components/ResearchQueuePanel';
import { AgentChat } from './components/AgentChat';
import { StatsBar } from './components/StatsBar';
import { AddKnowledgePanel } from './components/AddKnowledgePanel';
import { CATEGORY_LABELS } from './types';
import { cn } from './lib/utils';

const CATEGORIES = ['all', 'cat-tech', 'cat-science', 'cat-business', 'cat-health', 'cat-other'];
const STATUSES = ['all', 'stat-new', 'stat-processing', 'stat-absorbed'];
const STATUS_DISPLAY: Record<string, string> = { all: 'All', 'stat-new': 'New', 'stat-processing': 'Processing', 'stat-absorbed': 'Absorbed' };

export default function App() {
  const { entries, loading, fetchEntries, stats } = useKnowledgeBase();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || e.summary.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'all' || e.category === catFilter;
      const matchStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    });
  }, [entries, search, catFilter, statusFilter]);

  const hasFilters = catFilter !== 'all' || statusFilter !== 'all' || search;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-sm text-foreground tracking-tight">Knowledge Hub</span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search knowledge..."
              className="w-full bg-input border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all',
                showFilters || hasFilters
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-border bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-xl border border-border bg-secondary text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
            </button>
          </div>
        </div>

        {/* Filter row */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Category:</span>
                  <div className="flex gap-1.5 flex-wrap">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCatFilter(c)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium transition-all border',
                          catFilter === c
                            ? 'border-primary/50 bg-primary/20 text-primary'
                            : 'border-border bg-transparent text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {c === 'all' ? 'All' : CATEGORY_LABELS[c]}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  <div className="flex gap-1.5">
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium transition-all border',
                          statusFilter === s
                            ? 'border-primary/50 bg-primary/20 text-primary'
                            : 'border-border bg-transparent text-muted-foreground hover:text-foreground'
                        )}
                      >
                        {STATUS_DISPLAY[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Hero */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-1"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary">Living Knowledge Base</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-2xl font-bold text-foreground tracking-tight"
              >
                Your Knowledge Universe
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-muted-foreground mt-1"
              >
                Research flows in automatically. Intelligence grows without manual input.
              </motion.p>
            </div>

            {/* Stats */}
            <StatsBar {...stats} />

            {/* Entries grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground">
                  Knowledge Entries
                  {filtered.length !== entries.length && (
                    <span className="ml-2 text-muted-foreground font-normal">
                      ({filtered.length} of {entries.length})
                    </span>
                  )}
                </h2>
              </div>

              {loading && entries.length === 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-40 rounded-2xl bg-card animate-pulse border border-border" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No knowledge entries match your filters.</p>
                  {hasFilters && (
                    <button
                      onClick={() => { setSearch(''); setCatFilter('all'); setStatusFilter('all'); }}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((entry, i) => (
                    <KnowledgeCard key={entry.id} entry={entry} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 shrink-0">
            <AddKnowledgePanel onCompleted={fetchEntries} />
            <ResearchQueuePanel />
            <div className="rounded-2xl border border-border bg-card overflow-hidden h-[480px]">
              <AgentChat />
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile floating chat */}
      <div className="lg:hidden">
        <AgentChat floating />
      </div>
    </div>
  );
}
