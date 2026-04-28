import * as React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Loader2, BookOpen } from 'lucide-react';

interface Props {
  total: number;
  absorbed: number;
  processing: number;
  newCount: number;
}

export const StatsBar: React.FC<Props> = ({ total, absorbed, processing, newCount }) => {
  const stats = [
    { label: 'Total Entries', value: total, icon: BookOpen, color: 'text-foreground', bg: 'bg-secondary' },
    { label: 'Absorbed', value: absorbed, icon: Brain, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Processing', value: processing, icon: Loader2, color: 'text-amber-400', bg: 'bg-amber-500/10', spin: processing > 0 },
    { label: 'New', value: newCount, icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className={`rounded-2xl border border-border ${s.bg} p-4 flex items-center gap-3`}
        >
          <div className={`${s.color}`}>
            <s.icon className={`w-5 h-5 ${s.spin ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground leading-none">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
