import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Globe, Upload, Link as LinkIcon, Loader2, Check } from 'lucide-react';
import { cn } from '../lib/utils';

const WEBHOOK_WEB_URL = '/api/taskade/webhooks/01KMA7DY0WM6JNHTNE632PY68X/run';
const WEBHOOK_UPLOAD_URL = '/api/taskade/webhooks/01KMA7GQY7MXST7C72AYECZT44/run';

interface Props {
  onCompleted?: () => void;
}

export const AddKnowledgePanel: React.FC<Props> = ({ onCompleted }) => {
  const [mode, setMode] = useState<'web' | 'upload'>('web');
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('cat-other');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setUrl('');
    setTitle('');
    setCategory('cat-other');
    setFile(null);
    setSuccess(null);
    setError(null);
  };

  const submitWeb = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!url.trim()) return setError('Please provide a URL');
    setLoading(true);
    setError(null);
    try {
      const payload = { url: url.trim(), title: title.trim() || '', category };
      const res = await axios.post(WEBHOOK_WEB_URL, payload);
      setSuccess('Added knowledge from web');
      reset();
      onCompleted?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const submitUpload = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!file) return setError('Please choose a file');
    setLoading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append('file', file);
      if (title.trim()) fd.append('title', title.trim());
      if (category) fd.append('category', category);
      const res = await axios.post(WEBHOOK_UPLOAD_URL, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess('Uploaded and added knowledge');
      reset();
      onCompleted?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => { reset(); setMode('web'); }}
          className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all', mode === 'web' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-transparent text-muted-foreground')}
        >
          <Globe className="w-3.5 h-3.5 inline-block mr-1" /> Add from web
        </button>
        <button
          onClick={() => { reset(); setMode('upload'); }}
          className={cn('px-3 py-1.5 rounded-full text-xs font-medium border transition-all', mode === 'upload' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-transparent text-muted-foreground')}
        >
          <Upload className="w-3.5 h-3.5 inline-block mr-1" /> Upload file
        </button>
      </div>

      {mode === 'web' ? (
        <form onSubmit={submitWeb} className="space-y-2">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste a webpage URL" className="w-full bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground" />
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional title" className="w-full bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground" />
          <div className="flex items-center gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 bg-input border border-border rounded-xl px-3 py-2 text-xs text-foreground">
              <option value="cat-tech">Technology</option>
              <option value="cat-science">Science</option>
              <option value="cat-business">Business</option>
              <option value="cat-health">Health</option>
              <option value="cat-other">Other</option>
            </select>
            <button disabled={loading} type="submit" className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={submitUpload} className="space-y-2">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full text-xs text-foreground" />
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Optional title" className="w-full bg-input border border-border rounded-xl px-3 py-2 text-sm text-foreground" />
          <div className="flex items-center gap-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="flex-1 bg-input border border-border rounded-xl px-3 py-2 text-xs text-foreground">
              <option value="cat-tech">Technology</option>
              <option value="cat-science">Science</option>
              <option value="cat-business">Business</option>
              <option value="cat-health">Health</option>
              <option value="cat-other">Other</option>
            </select>
            <button disabled={loading} type="submit" className="px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            </button>
          </div>
        </form>
      )}

      <div className="text-xs mt-1">
        {success && <div className="text-emerald-400 inline-flex items-center gap-2"><Check className="w-3.5 h-3.5" />{success}</div>}
        {error && <div className="text-rose-400">{error}</div>}
      </div>
    </div>
  );
};

export default AddKnowledgePanel;
