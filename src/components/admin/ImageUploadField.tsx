import { useRef, useState, type ChangeEvent } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { uploadPortfolioImage } from '@/lib/storage';
import { toSafeErrorMessage } from '@/lib/error';

interface ImageUploadFieldProps {
  label: string;
  hint?: string;
  value: string;
  folder: string;
  placeholder?: string;
  onChange: (value: string) => void;
  previewClassName?: string;
}

export default function ImageUploadField({ label, hint, value, folder, placeholder, onChange, previewClassName = 'h-20 w-32' }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const url = await uploadPortfolioImage(file, folder);
      onChange(url);
    } catch (cause) {
      setError(toSafeErrorMessage(cause, 'Image upload failed. Please try again.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{label}</label>
      {hint && <p className="mb-2 text-xs text-slate-400">{hint}</p>}
      <div className="flex gap-3">
        <div className={`flex ${previewClassName} flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800`}>
          {value ? <img src={value} alt="" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.opacity = '0'; }} /> : <ImageIcon size={20} className="text-slate-300 dark:text-slate-600" />}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex gap-2">
            <input type="url" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder ?? 'https://example.com/image.jpg'}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-blue-900/40" />
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
              className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60">
              <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload'}
            </button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
          </div>
          <p className="text-[11px] text-slate-400">JPG, JPEG, PNG, or WEBP · 5 MB maximum</p>
        </div>
      </div>
      {error && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{error}</p>}
      {value && <a href={value} target="_blank" rel="noopener noreferrer" className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">Preview image</a>}
    </div>
  );
}
