import * as React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles } from 'lucide-react';
import { KnowledgeEntry, CATEGORY_LABELS, CATEGORY_COLORS, STATUS_LABELS, STATUS_COLORS } from '../types';

interface Props {
  entry: KnowledgeEntry;
  index: number;
}

export const KnowledgeCard: React.FC<Props> = ({ entry, index }) => {
  const catColor = CATEGORY_COLORS[entry.category] || CATEGORY_COLORS['cat-other'];
  const statColor = STATUS_COLORS[entry.status] || STATUS_COLORS['stat-new'];
  const catLabel = CATEGORY_LABELS[entry.category] || 'Other';
  const statLabel = STATUS_LABELS[entry.status] || 'New';
  const isAbsorbed = entry.status === 'stat-absorbed';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="group relative rounded-2xl border border-border bg-card p-5 hover:border-primary/40 hover:bg-card/80 transition-all duration-300"
    >
      {isAbsorbed && (
        <div className="absolute top-3 right-3">
          <Sparkles className="w-3.5 h-3.5 text-primary/60" />
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${catColor}`}>
          {catLabel}
        </span>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statColor}`}>
          {statLabel}
        </span>
      </div>

      <h3 className="font-semibold text-foreground mb-2 text-sm leading-snug group-hover:text-primary transition-colors">
        {entry.title}
      </h3>

      {entry.summary && (
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3">
          {entry.summary}
        </p>
      )}

      {entry.sourceUrl && entry.sourceUrl !== 'Web Research (Automated)' && (
        <a
          href={entry.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View Source
        </a>
      )}
    </motion.div>
  );
};
