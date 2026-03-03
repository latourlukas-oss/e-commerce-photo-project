'use client';

import { useState, useEffect, useCallback } from 'react';

const SECTIONS = ['hero', 'mission-cards', 'product-showcase', 'impact', 'cta', 'merch-stories'];
const SECTION_SELECTOR = SECTIONS.map((id) => `#${id}`).join(', ');

export function SectionSelector() {
  const [mounted, setMounted] = useState(false);
  const [copyMode, setCopyMode] = useState(false);
  const [toast, setToast] = useState<{ file: string; error?: string } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback((file: string, error?: string) => {
    setToast({ file, error });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    if (!window.location.hostname.includes('localhost')) return;

    const handleClick = async (e: MouseEvent) => {
      const useAlt = (e as MouseEvent).altKey;
      if (!copyMode && !useAlt) return;

      const target = e.target as HTMLElement;
      const sectionEl = target.closest?.(SECTION_SELECTOR);
      if (!sectionEl || !(sectionEl instanceof HTMLElement)) {
        if (copyMode) showToast('', 'Click on a section (hero, products, etc.)');
        return;
      }

      const id = sectionEl.id;
      if (!SECTIONS.includes(id)) return;

      e.preventDefault();
      e.stopPropagation();

      try {
        const res = await fetch(`/api/section-source?section=${encodeURIComponent(id)}`);
        const data = await res.json();

        if (!res.ok) {
          showToast(id, data?.error || 'API error');
          await navigator.clipboard.writeText(id);
          return;
        }

        const content = data.content as string;
        if (!content) {
          await navigator.clipboard.writeText(id);
          showToast(data.file || id);
          return;
        }

        try {
          await navigator.clipboard.writeText(content);
          showToast(data.file || id);
        } catch {
          await navigator.clipboard.writeText(id);
          showToast((data.file || id) + ' (section id copied – paste and say "edit ' + id + '")');
        }
      } catch {
        await navigator.clipboard.writeText(id);
        showToast(id, 'Section id copied – say "edit ' + id + '" in Cursor');
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [mounted, copyMode, showToast]);

  if (!mounted || typeof window === 'undefined') return null;
  if (!window.location.hostname.includes('localhost')) return null;

  const displayName = toast?.file?.replace(/\.tsx$/, '').replace(/.*\//, '') ?? '';

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-slate-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg">
        <button
          type="button"
          onClick={() => setCopyMode(!copyMode)}
          className={`px-3 py-1.5 rounded font-medium ${copyMode ? 'bg-teal-600' : 'bg-slate-600'}`}
        >
          Copy section code: {copyMode ? 'ON' : 'OFF'}
        </button>
        <span className="opacity-90">
          {copyMode ? 'Click any section to copy its code' : 'Or hold Alt and click a section'}
        </span>
      </div>
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[10000] bg-teal-600 text-white px-4 py-3 rounded-lg shadow-lg text-center max-w-md">
          {toast.error ? (
            <p className="text-sm">{toast.error}</p>
          ) : (
            <>
              <p className="font-medium">Copied: {toast.file}</p>
              <p className="text-[10px] mt-1 opacity-90">
                Paste in Cursor and say what to change, or say &quot;edit {displayName}&quot;
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}
