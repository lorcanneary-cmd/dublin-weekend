'use client';

import { useEffect, useState, useRef } from 'react';
import { WatchSelections } from '@/app/watch/page';
import { fetchTitles, posterUrl, TMDBTitle } from '@/lib/tmdb';
import { SERVICES, GENRES } from '@/components/watch/WatchPicker';

type Props = {
  selectionsA: WatchSelections;
  selectionsB: WatchSelections;
  onReset: () => void;
};

type TitleWithState = TMDBTitle & {
  seen: boolean;
  saved: boolean;
  removing: boolean;
  isSolo?: boolean;
};

const SERVICE_COLORS: Record<number, string> = {
  8:   '#e50914',
  119: '#00a8e0',
  350: '#1c1c1e',
  337: '#113ccf',
  531: '#0064ff',
  39:  '#00a550',
};

function getServiceName(id: number) {
  return SERVICES.find(s => s.id === id)?.name ?? '';
}

function getYear(t: TMDBTitle) {
  const d = t.release_date || t.first_air_date || '';
  return d.slice(0, 4);
}

function getGenreLabels(ids: number[]) {
  return ids
    .slice(0, 2)
    .map(id => GENRES.find(g => g.id === id || g.tvId === id)?.label)
    .filter(Boolean)
    .join(' · ');
}

export default function WatchResults({ selectionsA, selectionsB, onReset }: Props) {
  const [titles, setTitles] = useState<TitleWithState[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const touchStartX = useRef<Record<number, number>>({});

  const sharedServices = selectionsA.services.filter(id => selectionsB.services.includes(id));
  const sharedGenres = selectionsA.genres.filter(id => selectionsB.genres.includes(id));
  const soloGenres = [
    ...selectionsA.genres.filter(id => !selectionsB.genres.includes(id)),
    ...selectionsB.genres.filter(id => !selectionsA.genres.includes(id)),
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const sharedParams = {
          type: selectionsA.type,
          genres: sharedGenres.length > 0 ? sharedGenres : Array.from(new Set([...selectionsA.genres, ...selectionsB.genres])),
          services: sharedServices.length > 0 ? sharedServices : Array.from(new Set([...selectionsA.services, ...selectionsB.services])),
          era: selectionsA.era,
          length: selectionsA.length,
          includeNonEnglish: selectionsA.includeNonEnglish || selectionsB.includeNonEnglish,
        };

        let soloResults: TMDBTitle[] = [];
        if (soloGenres.length > 0 && sharedServices.length > 0) {
          soloResults = await fetchTitles({ ...sharedParams, genres: soloGenres });
        }

        const sharedResults = await fetchTitles(sharedParams);
        const soloIds = new Set(sharedResults.map(t => t.id));
        const uniqueSolo = soloResults.filter(t => !soloIds.has(t.id));

        const all: TitleWithState[] = [
          ...sharedResults.map(t => ({ ...t, seen: false, saved: false, removing: false })),
          ...uniqueSolo.map(t => ({ ...t, seen: false, saved: false, removing: false, isSolo: true })),
        ];

        setTitles(all);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectionsA, selectionsB]);

  const markSeen = (id: number) => {
    setTitles(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t));
    setTimeout(() => {
      setTitles(prev => prev.map(t => t.id === id ? { ...t, seen: true, removing: false } : t));
    }, 300);
  };

  const markSaved = (id: number) => {
    setTitles(prev => prev.map(t => t.id === id ? { ...t, saved: !t.saved } : t));
  };

  const restoreSeen = () => {
    setTitles(prev => prev.map(t => ({ ...t, seen: false })));
  };

  const handleTouchStart = (id: number, e: React.TouchEvent) => {
    touchStartX.current[id] = e.touches[0].clientX;
  };

  const handleTouchEnd = (id: number, e: React.TouchEvent) => {
    const startX = touchStartX.current[id];
    if (startX === undefined) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 60) markSeen(id);
    delete touchStartX.current[id];
  };

  const activeShared = titles.filter(t => !t.seen && !t.isSolo);
  const activeSolo   = titles.filter(t => !t.seen && t.isSolo);
  const seenTitles   = titles.filter(t => t.seen);
  const savedTitles  = titles.filter(t => t.saved);
  const hasSeen      = seenTitles.length > 0;
  const headingText  = hasSeen ? 'New to both of you' : 'Your matches';

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[#c8f04a] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-white/30">Finding your matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center gap-4">
        <i className="ti ti-wifi-off text-4xl text-white/20" aria-hidden="true" />
        <p className="text-sm text-white/40">Couldn't load results. Check your connection and try again.</p>
        <button onClick={onReset} className="px-6 py-3 rounded-2xl border border-white/10 text-sm text-white/40">
          Start over
        </button>
      </div>
    );
  }

  if (titles.length === 0) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center px-8 text-center gap-4">
        <i className="ti ti-mood-empty text-4xl text-white/20" aria-hidden="true" />
        <div>
          <p className="text-white font-medium mb-1">No matches found</p>
          <p className="text-sm text-white/30">Try different genres, more streaming apps, or turn off the era filter.</p>
        </div>
        <button onClick={onReset} className="px-6 py-3 rounded-2xl border border-white/10 text-sm text-white/40">
          Start over
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <div className="px-5 pt-12 pb-3">
        <h1 className="text-xl font-medium text-white mb-1">{headingText}</h1>
        <p className="text-xs text-white/30">
          {hasSeen
            ? `${activeShared.length + activeSolo.length} title${activeShared.length + activeSolo.length !== 1 ? 's' : ''} left after your sweep`
            : "Swipe left on anything you've already seen"}
        </p>
      </div>

      {!hasSeen && (
        <div className="mx-5 mb-4 px-4 py-3 rounded-xl bg-[#c8f04a]/10 border border-[#c8f04a]/20 flex items-start gap-3">
          <i className="ti ti-sparkles text-[#c8f04a] text-lg mt-0.5" aria-hidden="true" />
          <p className="text-xs text-[#c8f04a]/80 leading-relaxed">
            {selectionsA.name} &amp; {selectionsB.name} both want{' '}
            {sharedGenres
              .map(id => GENRES.find(g => g.id === id || g.tvId === id)?.label)
              .filter(Boolean)
              .join(' + ') || 'something good'}.{' '}
            {titles.length} match{titles.length !== 1 ? 'es' : ''} found.
          </p>
        </div>
      )}

      {!hasSeen && (
        <div className="flex items-center gap-2 px-5 mb-3">
          <i className="ti ti-arrow-left text-white/20 text-xs" aria-hidden="true" />
          <span className="text-[10px] text-white/20">swipe to mark seen</span>
          <i className="ti ti-heart text-white/20 text-xs ml-auto" aria-hidden="true" />
          <span className="text-[10px] text-white/20">tap to save</span>
        </div>
      )}

      {activeShared.length > 0 && (
        <>
          <SectionDivider label="Both of you" />
          {activeShared.map(t => (
            <TitleRow key={t.id} title={t} onSeen={markSeen} onSave={markSaved} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
          ))}
        </>
      )}

      {activeSolo.length > 0 && (
        <>
          <SectionDivider label="New for one of you" />
          {activeSolo.map(t => (
            <TitleRow key={t.id} title={t} onSeen={markSeen} onSave={markSaved} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
          ))}
        </>
      )}

      {activeShared.length === 0 && activeSolo.length === 0 && (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-white/30 mb-1">You've seen everything — impressive.</p>
          <p className="text-xs text-white/20">Try adjusting your genres or era filter.</p>
        </div>
      )}

      {hasSeen && (
        <button onClick={restoreSeen} className="mx-5 mt-4 px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <i className="ti ti-eye-off text-white/20 text-base" aria-hidden="true" />
          <span className="text-xs text-white/30">
            You've seen <span className="text-white/50">{seenTitles.length} title{seenTitles.length !== 1 ? 's' : ''}</span> together — not bad
          </span>
          <i className="ti ti-refresh text-white/20 text-xs ml-auto" aria-hidden="true" />
        </button>
      )}

      {savedTitles.length > 0 && (
        <>
          <SectionDivider label="Saved to watch" />
          {savedTitles.map(t => (
            <TitleRow key={`saved-${t.id}`} title={t} onSeen={markSeen} onSave={markSaved} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} />
          ))}
        </>
      )}

      <div className="px-5 mt-8 mb-4">
        <button onClick={onReset} className="w-full py-3 rounded-2xl border border-white/10 text-xs text-white/20">
          Start over
        </button>
      </div>

      <p className="text-center text-[10px] text-white/15 px-5 pb-6">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-5 my-3">
      <span className="text-[10px] text-white/25 font-medium uppercase tracking-widest whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  );
}

type RowProps = {
  title: TitleWithState;
  onSeen: (id: number) => void;
  onSave: (id: number) => void;
  onTouchStart: (id: number, e: React.TouchEvent) => void;
  onTouchEnd: (id: number, e: React.TouchEvent) => void;
};

function TitleRow({ title, onSeen, onSave, onTouchStart, onTouchEnd }: RowProps) {
  const primaryProvider = title.provider_ids[0];
  return (
    <div
      className={`flex items-center gap-3 px-5 py-2.5 transition-all duration-300 ${title.removing ? 'opacity-0 scale-95' : 'opacity-100'}`}
      onTouchStart={e => onTouchStart(title.id, e)}
      onTouchEnd={e => onTouchEnd(title.id, e)}
    >
      <div className="w-11 h-16 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden">
        {title.poster_path ? (
          <img src={posterUrl(title.poster_path)} alt={title.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="ti ti-movie text-white/20" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title.title}</p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {primaryProvider && (
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: SERVICE_COLORS[primaryProvider] ?? '#333' }}>
              {getServiceName(primaryProvider)}
            </span>
          )}
          <span className="text-[10px] text-white/30">
            {getGenreLabels(title.genre_ids)}{getYear(title) ? ` · ${getYear(title)}` : ''}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button
          onClick={() => onSave(title.id)}
          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
            title.saved ? 'border-[#c8f04a]/40 bg-[#c8f04a]/10 text-[#c8f04a]' : 'border-white/10 bg-white/5 text-white/30'
          }`}
          aria-label="Save to watch later"
        >
          <i className={`ti ${title.saved ? 'ti-heart-filled' : 'ti-heart'} text-sm`} aria-hidden="true" />
        </button>
        <button
          onClick={() => onSeen(title.id)}
          className="w-8 h-8 rounded-full border border-white/10 bg-white/5 text-white/20 flex items-center justify-center"
          aria-label="Mark as seen"
        >
          <i className="ti ti-eye-off text-sm" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
