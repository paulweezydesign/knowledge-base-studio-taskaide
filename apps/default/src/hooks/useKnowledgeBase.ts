import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { KnowledgeEntry } from '../types';

const KB_PROJECT_ID = '8eRokCUHJTw5e5Qd';

function parseNode(node: any): KnowledgeEntry {
  const fv = node.fieldValues || {};
  return {
    id: node.id,
    title: fv['/text'] || '',
    summary: fv['/attributes/@kbSum'] || '',
    sourceUrl: fv['/attributes/@kbSrc'] || '',
    category: fv['/attributes/@kbCat'] || '',
    status: fv['/attributes/@kbStat'] || '',
    parentId: node.parentId,
  };
}

export function useKnowledgeBase() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/taskade/projects/${KB_PROJECT_ID}/nodes`);
      const nodes: any[] = res.data?.payload?.nodes || [];
      const parsed = nodes
        .filter((n) => n.parentId === null && (n.fieldValues?.['/text'] || '').trim())
        .map(parseNode);
      setEntries(parsed);
      setError(null);
    } catch (e) {
      setError('Failed to load knowledge base');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    const interval = setInterval(fetchEntries, 15000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  const addEntry = useCallback(
    async (data: { title: string; summary: string; sourceUrl: string; category: string }) => {
      await axios.post(`/api/taskade/projects/${KB_PROJECT_ID}/nodes`, {
        '/text': data.title,
        '/attributes/@kbSum': data.summary,
        '/attributes/@kbSrc': data.sourceUrl,
        '/attributes/@kbCat': data.category || 'cat-other',
        '/attributes/@kbStat': 'stat-new',
        parentId: null,
      });
      await fetchEntries();
    },
    [fetchEntries]
  );

  const absorbed = entries.filter((e) => e.status === 'stat-absorbed').length;
  const processing = entries.filter((e) => e.status === 'stat-processing').length;
  const newCount = entries.filter((e) => e.status === 'stat-new').length;

  return { entries, loading, error, fetchEntries, addEntry, stats: { absorbed, processing, newCount, total: entries.length } };
}
