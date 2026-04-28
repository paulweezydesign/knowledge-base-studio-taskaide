import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ResearchItem } from '../types';

const RQ_PROJECT_ID = 'AqjxZxvX4jJgsD5r';

function parseNode(node: any): ResearchItem {
  const fv = node.fieldValues || {};
  return {
    id: node.id,
    title: fv['/text'] || '',
    topic: fv['/attributes/@rqTopic'] || fv['/text'] || '',
    priority: fv['/attributes/@rqPri'] || '',
    stage: fv['/attributes/@rqStage'] || '',
    parentId: node.parentId,
  };
}

export function useResearchQueue() {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/taskade/projects/${RQ_PROJECT_ID}/nodes`);
      const nodes: any[] = res.data?.payload?.nodes || [];
      const parsed = nodes
        .filter((n) => n.parentId === null && (n.fieldValues?.['/text'] || '').trim())
        .map(parseNode);
      setItems(parsed);
      setError(null);
    } catch (e) {
      setError('Failed to load research queue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    const interval = setInterval(fetchItems, 15000);
    return () => clearInterval(interval);
  }, [fetchItems]);

  const queueResearch = useCallback(
    async (topic: string, priority: string = 'pri-med') => {
      await axios.post(`/api/taskade/projects/${RQ_PROJECT_ID}/nodes`, {
        '/text': topic,
        '/attributes/@rqTopic': topic,
        '/attributes/@rqPri': priority,
        '/attributes/@rqStage': 'stage-queued',
        parentId: null,
      });
      await fetchItems();
    },
    [fetchItems]
  );

  const queued = items.filter((i) => i.stage === 'stage-queued').length;
  const done = items.filter((i) => i.stage === 'stage-done').length;

  return { items, loading, error, fetchItems, queueResearch, stats: { queued, done, total: items.length } };
}
