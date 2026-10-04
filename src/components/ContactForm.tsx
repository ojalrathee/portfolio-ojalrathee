import { useState, type FormEvent } from 'react';
import { Send, CheckCircle2, Shield, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { rateLimiter } from '@/lib/rateLimiter';
import { toSafeErrorMessage } from '@/lib/error';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [charCount, setCharCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get('name') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();
    const engagementType = formData.get('engagement-type') as string;
    const rawMessage = (formData.get('message') as string)?.trim();

    const fullMessage = engagementType
      ? `[Engagement: ${engagementType}]\n\n${rawMessage}`
      : rawMessage;

    // Enforce rate limiting: max 5 messages per 10 minutes
    const rateCheck = rateLimiter.checkContactSubmit();
    if (!rateCheck.allowed) {
      setStatus('error');
      setErrorMessage(rateCheck.errorMessage || 'Too many messages sent. Please wait before retrying.');
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert({ name, email, message: fullMessage });

      if (error) {
        setStatus('error');
        setErrorMessage(toSafeErrorMessage(error, 'Failed to dispatch message. Please try again or email directly.'));
        return;
      }

      rateLimiter.recordContactSubmit();
      setStatus('sent');
      form.reset();
      setCharCount(0);
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      setStatus('error');
      setErrorMessage(toSafeErrorMessage(err, 'Network error. Please try again or email directly.'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name & Email inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label
            htmlFor="contact-name"
            className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-[#64748B]"
          >
            NAME <span className="text-[#2563eb] dark:text-[#3B82F6]">*</span>
          </label>
          <div className="rounded-xl bg-slate-50 dark:bg-[#060e20] border border-slate-300 dark:border-white/[0.06] focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/20 transition-all">
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              placeholder="Your name"
              className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-[#dae2fd] placeholder-slate-400 dark:placeholder-[#64748B] outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contact-email"
            className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-[#64748B]"
          >
            EMAIL <span className="text-[#2563eb] dark:text-[#3B82F6]">*</span>
          </label>
          <div className="rounded-xl bg-slate-50 dark:bg-[#060e20] border border-slate-300 dark:border-white/[0.06] focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/20 transition-all">
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-[#dae2fd] placeholder-slate-400 dark:placeholder-[#64748B] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Engagement Type Selector */}
      <div className="space-y-1.5">
        <label
          htmlFor="engagement-type"
          className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-[#64748B]"
        >
          ENGAGEMENT TYPE
        </label>
        <div className="rounded-xl bg-slate-50 dark:bg-[#060e20] border border-slate-300 dark:border-white/[0.06] focus-within:border-[#2563eb] transition-all">
          <select
            id="engagement-type"
            name="engagement-type"
            className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 dark:text-[#dae2fd] outline-none cursor-pointer"
          >
            <option value="Full-time Engineering Role" className="bg-white dark:bg-[#171f33] text-slate-900 dark:text-white">
              Full-time Engineering Role / Internship
            </option>
            <option value="Freelance Contract / Consulting" className="bg-white dark:bg-[#171f33] text-slate-900 dark:text-white">
              Freelance Contract / Cloud Consulting
            </option>
            <option value="System Architecture Review" className="bg-white dark:bg-[#171f33] text-slate-900 dark:text-white">
              System Architecture &amp; AWS Review
            </option>
            <option value="Technical Discussion / Hello" className="bg-white dark:bg-[#171f33] text-slate-900 dark:text-white">
              Technical Discussion / Say Hello
            </option>
          </select>
        </div>
      </div>

      {/* Message Textarea */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="contact-message"
            className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-[#64748B]"
          >
            MESSAGE <span className="text-[#2563eb] dark:text-[#3B82F6]">*</span>
          </label>
          <span className="font-mono text-[11px] text-slate-500 dark:text-[#64748B]">
            {charCount} / 1000
          </span>
        </div>
        <div className="rounded-xl bg-slate-50 dark:bg-[#060e20] border border-slate-300 dark:border-white/[0.06] focus-within:border-[#2563eb] focus-within:ring-2 focus-within:ring-[#2563eb]/20 transition-all">
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            maxLength={1000}
            placeholder="Tell me about your project, timeline, architecture stack, or role..."
            onChange={(e) => setCharCount(e.target.value.length)}
            className="w-full bg-transparent p-4 text-sm text-slate-900 dark:text-[#dae2fd] placeholder-slate-400 dark:placeholder-[#64748B] outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Submission Feedback */}
      {status === 'sent' && (
        <div className="rounded-xl bg-emerald-50 dark:bg-[#00a572]/15 border border-emerald-200 dark:border-[#10B981]/30 p-4 text-[#00a572] dark:text-[#4edea3] font-mono text-xs flex items-center gap-3">
          <CheckCircle2 size={18} className="text-[#10B981] flex-shrink-0" />
          <span>Message dispatched successfully. Response expected in &lt;24h.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-500/30 p-4 text-red-600 dark:text-red-400 font-mono text-xs">
          {errorMessage || 'Dispatch failed. Please retry or email directly.'}
        </div>
      )}

      {/* Action Button & Security Assurance */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-[#64748B]">
          <Shield size={16} className="text-[#10B981]" />
          <span>Direct to inbox &amp; TLS encrypted</span>
        </div>

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
        >
          {status === 'sending' ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>SENDING...</span>
            </>
          ) : status === 'sent' ? (
            <>
              <CheckCircle2 size={18} />
              <span>SENT!</span>
            </>
          ) : (
            <>
              <span>SEND MESSAGE</span>
              <Send size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
