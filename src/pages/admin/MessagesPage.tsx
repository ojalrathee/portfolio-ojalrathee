import { useEffect, useState } from 'react';
import { Trash2, Mail, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('id, name, email, message, created_at')
      .order('created_at', { ascending: false });
    setMessages((data as Message[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { loadMessages(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    setMessages(messages.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  if (loading) return <p className="text-slate-400">Loading messages…</p>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Messages</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{messages.length} message{messages.length !== 1 ? 's' : ''} from your contact form.</p>

      {messages.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-700">
          <Mail size={32} className="mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium text-slate-400">No messages yet.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Message list */}
          <div className="space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelected(m)}
                className={`cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition-all dark:bg-slate-900 ${
                  selected?.id === m.id
                    ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/40'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-slate-900 dark:text-white">{m.name}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{m.email}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Calendar size={12} />
                    {new Date(m.created_at).toLocaleDateString()}
                  </div>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{m.message}</p>
              </div>
            ))}
          </div>

          {/* Selected message detail */}
          {selected && (
            <div className="lg:sticky lg:top-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selected.name}</h3>
                    <a href={`mailto:${encodeURIComponent(selected.email.trim())}`} className="text-sm text-blue-600 hover:underline dark:text-blue-400">{selected.email}</a>
                    <p className="mt-1 text-xs text-slate-400">{new Date(selected.created_at).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="rounded-xl bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/60"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">{selected.message}</p>
                </div>
                <a
                  href={`mailto:${encodeURIComponent(selected.email.trim())}?subject=${encodeURIComponent('Re: Your message')}&body=${encodeURIComponent(`Hi ${selected.name.trim()},\n\n`)}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                >
                  <Mail size={14} /> Reply
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
