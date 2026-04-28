import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Loader2, Sparkles, X, MessageCircle } from 'lucide-react';
import { useAgentChat, createConversation } from '../lib/agent-chat';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';

const AGENT_ID = '01KMA6456NA7PWFNNS65QY2J1J';

const STARTERS = [
  { title: 'Overview', prompt: 'Give me a high-level overview of all topics in my knowledge base and how they connect.' },
  { title: 'Knowledge gaps', prompt: 'Based on my knowledge base, what important topics am I missing? Suggest 3-5 research directions.' },
  { title: 'Connect the dots', prompt: 'What surprising connections exist between the different topics in my knowledge base?' },
];

interface Props {
  floating?: boolean;
}

export const AgentChat: React.FC<Props> = ({ floating = false }) => {
  const [open, setOpen] = useState(!floating);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [starting, setStarting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { sendMessage, messages, isConnected } = useAgentChat(AGENT_ID, conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStart = async () => {
    if (conversationId || starting) return;
    setStarting(true);
    try {
      const { conversationId: newId } = await createConversation(AGENT_ID);
      setConversationId(newId);
    } finally {
      setStarting(false);
    }
  };

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || !conversationId) return;
    setInput('');
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border shrink-0">
        <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Knowledge Curator</p>
          <div className="flex items-center gap-1.5">
            <div className={cn('w-1.5 h-1.5 rounded-full', isConnected ? 'bg-emerald-400' : 'bg-slate-500')} />
            <span className="text-[10px] text-muted-foreground">{isConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
        {floating && (
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!conversationId && (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="bg-secondary rounded-2xl rounded-tl-sm p-3 text-xs text-foreground leading-relaxed max-w-[85%]">
                Hello! I'm your Knowledge Curator 🧠 — I've absorbed the research in your Knowledge Base and I'm ready to help you explore, connect ideas, and surface insights. What would you like to learn today?
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s.title}
                  onClick={async () => {
                    await handleStart();
                    setTimeout(() => handleSend(s.prompt), 300);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                >
                  {s.title}
                </button>
              ))}
            </div>
            <button
              onClick={handleStart}
              disabled={starting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 text-primary text-xs font-medium transition-colors disabled:opacity-50"
            >
              {starting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageCircle className="w-3.5 h-3.5" />}
              Start Conversation
            </button>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex gap-3', isUser && 'flex-row-reverse')}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    'rounded-2xl p-3 text-xs leading-relaxed max-w-[85%]',
                    isUser
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-secondary text-foreground rounded-tl-sm'
                  )}
                >
                  {isUser ? (
                    msg.content
                  ) : (
                    <ReactMarkdown className="prose prose-xs prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      {msg.content || '...'}
                    </ReactMarkdown>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={conversationId ? 'Ask about your knowledge...' : 'Start a conversation first'}
            disabled={!conversationId}
            className="flex-1 bg-input border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || !conversationId}
            className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  if (!floating) {
    return (
      <div className="flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden">
        {chatContent}
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 w-80 h-[480px] z-50 rounded-2xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden"
          >
            {chatContent}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => {
          setOpen((v) => !v);
          if (!conversationId) handleStart();
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-2xl bg-primary shadow-lg shadow-primary/30 flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {open ? <X className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </motion.button>
    </>
  );
};
