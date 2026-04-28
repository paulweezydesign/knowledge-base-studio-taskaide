export interface KnowledgeEntry {
  id: string;
  title: string;
  summary: string;
  sourceUrl: string;
  category: 'cat-tech' | 'cat-science' | 'cat-business' | 'cat-health' | 'cat-other' | '';
  status: 'stat-new' | 'stat-processing' | 'stat-absorbed' | '';
  parentId: string | null;
}

export interface ResearchItem {
  id: string;
  title: string;
  topic: string;
  priority: 'pri-high' | 'pri-med' | 'pri-low' | '';
  stage: 'stage-queued' | 'stage-researching' | 'stage-done' | '';
  parentId: string | null;
}

export const CATEGORY_LABELS: Record<string, string> = {
  'cat-tech': 'Technology',
  'cat-science': 'Science',
  'cat-business': 'Business',
  'cat-health': 'Health',
  'cat-other': 'Other',
};

export const CATEGORY_COLORS: Record<string, string> = {
  'cat-tech': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  'cat-science': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'cat-business': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'cat-health': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'cat-other': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
};

export const STATUS_LABELS: Record<string, string> = {
  'stat-new': 'New',
  'stat-processing': 'Processing',
  'stat-absorbed': 'Absorbed',
};

export const STATUS_COLORS: Record<string, string> = {
  'stat-new': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  'stat-processing': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'stat-absorbed': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
};

export const PRIORITY_LABELS: Record<string, string> = {
  'pri-high': 'High',
  'pri-med': 'Medium',
  'pri-low': 'Low',
};

export const PRIORITY_COLORS: Record<string, string> = {
  'pri-high': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'pri-med': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'pri-low': 'bg-slate-500/20 text-slate-300 border-slate-500/30',
};
