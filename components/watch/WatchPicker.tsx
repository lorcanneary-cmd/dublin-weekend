'use client';

import { useState } from 'react';
import { WatchSelections, WatchType } from '@/app/watch/page';

export const SERVICES = [
  { id: 8,   name: 'Netflix',    color: '#e50914', label: 'N',  icon: false },
  { id: 119, name: 'Prime',      color: '#00a8e0', label: 'P',  icon: false },
  { id: 350, name: 'Apple TV+',  color: '#1c1c1e', label: '',   icon: true  },
  { id: 337, name: 'Disney+',    color: '#113ccf', label: 'D+', icon: false },
  { id: 531, name: 'Paramount+', color: '#0064ff', label: 'P+', icon: false },
  { id: 39,  name: 'NOW TV',     color: '#00a550', label: 'N',  icon: false },
];

export const GENRES = [
  { id: 53,    label: 'Thriller',    tvId: 9648  },
  { id: 35,    label: 'Comedy',      tvId: 35    },
  { id: 18,    label: 'Drama',       tvId: 18    },
  { id: 27,    label: 'Horror',      tvId: 27    },
  { id: 878,   label: 'Sci-Fi',      tvId: 10765 },
  { id: 28,    label: 'Action',      tvId: 10759 },
  { id: 10749, label: 'Romance',     tvId: 10749 },
  { id: 80,    label: 'Crime',       tvId: 80    },
  { id: 99,    label: 'Documentary', tvId: 99    },
  { id: 16,    label: 'Animation',   tvId: 16    },
];

type Props = {
  step: 1 | 2;
  onDone: (selections: WatchSelections) => void;
};

export default function WatchPicker({ step, onDone }: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<WatchType>('movie');
  const [services, setServices] = useState<number[]>([]);
  const [genres, setGenres] = useState<number[]>([]);
  const [length, setLength] = useState<'short' | 'medium' | 'long' | null>(null);
  const [era, setEra] = useState<'fresh' | 'any' | 'classic'>('any');
  const [includeNonEnglish, setIncludeNonEnglish] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const toggleService = (id: number) =>
    setServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);

  const toggleGenre = (id: number) =>
    setGenres(prev => {
      if (prev.includes(id)) return prev.filter(g => g !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });

  const canSubmit = name.trim().length > 0 && services.length > 0 && genres.length > 0;

  const handleDone = () => {
    if (!canSubmit) return;
    const mappedGenres = type === 'tv'
      ? genres.map(id => GENRES.find(g => g.id === id)?.tvId ?? id)
      : genres;
    onDone({ name: name.trim(), type, services, genres: mappedGenres, length, era, includeNonEnglish });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="px-5 pt-12 pb-3">
        <p className="text-2xl font-semibold text-white leading-tight">
          {step === 1 ? 'Pick what you\'re into' : 'Now your turn'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-36">
        <div className="mt-6 mb-6">
          <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
            Your name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Sarah"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#c8f04a]/50 transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">
            Movie or series?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['movie', 'tv'] as WatchType[]).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-sm transition-all ${
                  type === t
                    ? 'border-[#c8f04a] bg-[#c8f04a]/10 text-[#c8f04a]'
                    : 'border-white/10 bg-white/5 text-white/40'
                }`}
              >
                <i className={`ti ${t === 'movie' ? 'ti-movie' : 'ti-device-tv'} text-xl`} aria-hidden="true" />
                <span>{t === 'movie' ? 'Movie' : 'TV series'}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs text-white/40 uppercase tracking-widest mb-3">
            Your streaming apps
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SERVICES.map(s => (
              <button
                key={s.id}
                onClick={() => toggleService(s.id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${
                  services.includes(s.id)
                    ? 'border-[#c8f04a] bg-[#c8f04a]/10'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-semibold"
                  style={{ backgroundColor: s.color }}
                >
                  {s.icon
                    ? <i className="ti ti-brand-apple text-sm" aria-hidden="true" />
                    : s.label}
                </div>
                <span className={`text-[10px] ${services.includes(s.id) ? 'text-[#c8f04a]' : 'text-white/40'}`}>
                  {s.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs text-white/40 uppercase tracking-widest mb-1">
            Genres
          </label>
          <p className="text-xs text-white/20 mb-3">Pick up to 3</p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map(g => (
              <button
                key={g.id}
                onClick={() => toggleGenre(g.id)}
                className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                  genres.includes(g.id) || genres.includes(g.tvId)
                    ? 'border-[#c8f04a] bg-[#c8f04a]/10 text-[#c8f04a]'
                    : 'border-white/10 bg-white/5 text-white/40'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        <div className="border border-white/10 rounded-xl overflow-hidden mb-4">
          <button
            onClick={() => setMoreOpen(o => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-xs text-white/30"
          >
            <span>More options</span>
            <i className={`ti ti-chevron-down text-base transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {moreOpen && (
            <div className="px-4 pb-4 space-y-4 border-t border-white/10">
              <div className="pt-4">
                <p className="text-xs text-white/30 mb-2">How long do you have?</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {([
                    { val: 'short',  label: 'Quick one' },
                    { val: 'medium', label: 'Proper sit-down' },
                    { val: 'long',   label: 'Committed' },
                  ] as const).map(o => (
                    <button
                      key={o.val}
                      onClick={() => setLength(prev => prev === o.val ? null : o.val)}
                      className={`py-2 rounded-lg border text-[10px] transition-all ${
                        length === o.val
                          ? 'border-[#c8f04a] bg-[#c8f04a]/10 text-[#c8f04a]'
                          : 'border-white/10 bg-white/5 text-white/30'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-white/30 mb-2">Era</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {([
                    { val: 'fresh',   label: 'Fresh' },
                    { val: 'any',     label: 'Any' },
                    { val: 'classic', label: 'Classic' },
                  ] as const).map(o => (
                    <button
                      key={o.val}
                      onClick={() => setEra(o.val)}
                      className={`py-2 rounded-lg border text-[10px] transition-all ${
                        era === o.val
                          ? 'border-[#c8f04a] bg-[#c8f04a]/10 text-[#c8f04a]'
                          : 'border-white/10 bg-white/5 text-white/30'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/30">Include non-English titles</span>
                <button
                  onClick={() => setIncludeNonEnglish(v => !v)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${includeNonEnglish ? 'bg-[#c8f04a]' : 'bg-white/10'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${includeNonEnglish ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-5 pb-24 pt-4 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/95 to-transparent">
        <button
          onClick={handleDone}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-2xl text-sm font-medium transition-all ${
            canSubmit
              ? 'bg-[#c8f04a] text-[#0e0e0e] active:scale-[0.98]'
              : 'bg-white/5 text-white/20 cursor-not-allowed'
          }`}
        >
          {step === 1 ? 'Done — pass to Person 2' : 'See our picks'}
        </button>
        {!canSubmit && (
          <p className="text-center text-xs text-white/20 mt-2">
            {!name.trim()
              ? 'Enter your name to continue'
              : !services.length
              ? 'Pick at least one streaming app'
              : 'Pick at least one genre'}
          </p>
        )}
      </div>
    </div>
  );
}
