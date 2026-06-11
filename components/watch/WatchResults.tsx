'use client';

import { useEffect, useState, useRef } from 'react';
import { WatchSelections } from '@/app/watch/page';
import { fetchTitles, posterUrl, TMDBTitle } from '@/lib/tmdb';
import { SERVICES, GENRES } from '@/components/watch/WatchPicker';
import Countdown from '@/components/Countdown';

type Props = {
  selectionsA: WatchSelections;
  selectionsB: WatchSelections;
  onReset: () => void;
};

type TitleWithState = TMDBTitle & {
  seen: boolean;
  saved: boolean;
  removing: boolean;
  savingAnim: boolean;
  isSolo?: boolean;
};

type ViewState = 'reveal' | 'results' | 'shortlist' | 'congrats';

const SERVICE_COLORS: Record<number, string> = {
  8:   '#e50914',
  119: '#00a8e0',
  350: '#1c1c1e',
  337: '#113ccf',
  531: '#0064ff',
  39:  '#00a550',
};

const REVEAL_MESSAGES = [
  'Great minds think alike.',
  'Popcorn consensus reached.',
  'Two people, one remote. This is rare.',
  'You actually agreed on something. Write this down.',
  'Rare event: both of you want the same thing.',
  'The algorithm didn\'t do this — you did.',
];

const CONGRATS_MESSAGES = [
  'Get the popcorn on. Tonight\'s sorted.',
  'Decision made. No take-backs.',
  'Lights down, phones away. Enjoy it.',
  'That\'s the one. Now actually watch it.',
];

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

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function WatchResults({ selectionsA, selectionsB, onReset }: Props) {
  const [titles, setTitles] = useState<TitleWithState[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCountdown, setShowCountdown] = useState(true);
  const [error, setError] = useState(false);
  const [view, setView] = useState<ViewState>('reveal');
  const [chosenTitle, setChosenTitle] = useState<TitleWithState | null>(null);
  const touchStartX = useRef<Record<number, number>>({});
  const revealMessage = useRef(randomFrom(REVEAL_MESSAGES));
  const congratsMessage = useRef(randomFrom(CONGRATS_MESSAGES));

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
        const services = sharedServices.length > 0
          ? sharedServices
          : Array.from(new Set([...selectionsA.services, ...selectionsB.services]));
        const genres = sharedGenres.length > 0
          ? sharedGenres
          : Array.from(new Set([...selectionsA.genres, ...selectionsB.genres]));

        const sharedParams = {
          type: selectionsA.type,
          services,
          genres,
          era: selectionsA.era,
          length: selectionsA.length,
          includeNonEnglish: selectionsA.includeNonEnglish || selectionsB.includeNonEnglish,
        };

        const sharedResults = await fetchTitles(sharedParams);

        let soloResults: TMDBTitle[] = [];
        if (soloGenres.length > 0 && sharedServices.length > 0) {
          soloResults = await fetchTitles({ ...sharedParams, genres: soloGenres });
        }

        const sharedIds = new Set(sharedResults.map(t => t.id));
        const uniqueSolo = soloResults.filter(t => !sharedIds.has(t.id));

        const all: TitleWithState[] = [
          ...sharedResults.map(t => ({ ...t, seen: false, saved: false, removing: false, savingAnim: false })),
          ...uniqueSolo.map(t => ({ ...t, seen: false, saved: false, removing: false, savingAnim: false, isSolo: true })),
        ];

        setTitles(all);
      } catch (err) {
        console.error('WatchResults error:', err);
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
    setTitles(prev => prev.map(t => {
      if (t.id !== id) return t;
      if (t.saved) return { ...t, saved: false };
      return { ...t, saved: true, savingAnim: true };
    }));
    setTimeout(() => {
      setTitles(prev => prev.map(t => t.id === id ? { ...t, savingAnim: false } : t));
    }, 400);
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
    if (diff > 60) markSeen(id);       // swipe left → seen
    if (diff < -60) markSaved(id);     // swipe right → save
    delete touchStartX.current[id];
  };

  const handlePickFromShortlist = (title: TitleWithState) => {
    setChosenTitle(title);
    setView('congrats');
  };

  const activeShared = titles.filter(t => !t.seen && !t.isSolo);
  const activeSolo   = titles.filter(t => !t.seen && t.isSolo);
  const seenTitles   = titles.filter(t => t.seen);
  const savedTitles  = titles.filter(t => t.saved);
  const hasSeen      = seenTitles.length > 0;

  // Countdown shows while data is loading
  if (showCountdown) {
    return (
      <Countdown onComplete={() => {
        setShowCountdown(false);
        // If still loading after countdown, we show a minimal wait state
      }} />
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0f0f0f] items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
        <p className="text-sm text-white/30">Almost there...</p>
      </div>
    );
  }

  if (view === 'reveal') {
    const revealGenreLabels = sharedGenres
      .map(id => GENRES.find(g => g.id === id || g.tvId === id)?.label)
      .filter(Boolean);
    const soloGenreLabels = soloGenres
      .map(id => GENRES.find(g => g.id === id || g.tvId === id)?.label)
      .filter(Boolean);

    return (
      <div className="flex flex-col min-h-screen bg-[#0e0e0e] px-6 pt-20 pb-10">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-white leading-tight mb-2">
            {selectionsA.name} & {selectionsB.name} have something in common.
          </h1>
          <p className="text-sm text-white/40 italic mb-8">
            {revealMessage.current}
          </p>

          <div className="h-px bg-white/10 mb-6" />

          {revealGenreLabels.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">You both want</p>
              <div className="flex flex-wrap gap-2">
                {revealGenreLabels.map(label => (
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c8f04a]/10 border border-[#c8f04a]/30">
                    <i className="ti ti-check text-[#c8f04a] text-xs" aria-hidden="true" />
                    <span className="text-xs text-[#c8f04a] font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {soloGenreLabels.length > 0 && (
            <div className="mb-6">
              <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Only one of you wants</p>
              <div className="flex flex-wrap gap-2">
                {soloGenreLabels.map(label => (
                  <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10">
                    <span className="text-xs text-white/30">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-white/10 mb-8" />
        </div>

        <button
          onClick={() => setView('results')}
          className="w-full py-4 rounded-2xl bg-white text-[#0e0e0e] text-sm font-semibold"
        >
          show our picks
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0e0e0e] items-center justify-center px-8 text-center gap-4">
        <i className="ti ti-wifi-off text-4xl text-white/20" aria-hidden="true" />
        <p className="text-sm text-white/40">Could not load results. Check your connection and try again.</p>
        <button onClick={onReset} className="px-6 py-3 rounded-2xl border border-white/10 text-sm text-white/40">Start over</button>
      </div>
    );
  }

  // Congrats screen
  if (view === 'congrats' && chosenTitle) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0e0e0e] items-center justify-center px-8 text-center gap-8">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <i className="ti ti-confetti text-2xl text-white/60" aria-hidden="true" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-white leading-tight">{chosenTitle.title}</h2>
          <p className="text-sm text-white/40 italic">{congratsMessage.current}</p>
        </div>
        <button onClick={onReset} className="px-6 py-3 rounded-2xl border border-white/10 text-sm text-white/30">Start over</button>
      </div>
    );
  }

  // Shortlist screen
  if (view === 'shortlist') {
    return (
      <div className="flex flex-col min-h-screen bg-[#0e0e0e] pb-24">
        <div className="px-5 pt-12 pb-3 flex items-center gap-3">
          <button onClick={() => setView('results')} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <i className="ti ti-arrow-left text-sm text-white/40" aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-xl font-medium text-white">Shortlist</h1>
            <p className="text-xs text-white/30">{savedTitles.length} title{savedTitles.length !== 1 ? 's' : ''} — pick one</p>
          </div>
        </div>

        {savedTitles.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <i className="ti ti-heart text-4xl text-white/10" aria-hidden="true" />
            <p className="text-sm text-white/30">Swipe right on anything you want to keep</p>
          </div>
        ) : (
          <div className="px-5 space-y-2 mt-2">
            {savedTitles.map(t => (
              <button
                key={t.id}
                onClick={() => handlePickFromShortlist(t)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 active:scale-[0.98] transition-transform text-left"
              >
                <div className="w-11 h-16 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 overflow-hidden">
                  {t.poster_path ? (
                    <img src={posterUrl(t.poster_path)} alt={t.title} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <i className="ti ti-movie text-white/20" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{t.title}</p>
                  <p className="text-xs text-white/30 mt-0.5">{getGenreLabels(t.genre_ids)}{getYear(t) ? ` · ${getYear(t)}` : ''}</p>
                </div>
                <i className="ti ti-chevron-right text-white/20 flex-shrink-0" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}

        <div className="px-5 mt-6">
          <button onClick={() => setView('results')} className="w-full py-3 rounded-2xl border border-white/10 text-xs text-white/30">
            Back to results
          </button>
        </div>
      </div>
    );
  }

  // No titles found
  if (titles.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#0e0e0e] items-center justify-center px-8 text-center gap-4">
        <i className="ti ti-mood-empty text-4xl text-white/20" aria-hidden="true" />
        <div>
          <p className="text-white font-medium mb-1">No matches found</p>
          <p className="text-sm text-white/30">Try different genres, more streaming apps, or turn off the era filter.</p>
        </div>
        <button onClick={onReset} className="px-6 py-3 rounded-2xl border border-white/10 text-sm text-white/40">Start over</button>
      </div>
    );
  }

  // Main results screen
  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e] pb-36">
      <div className="px-5 pt-12 pb-3">
        <h1 className="text-xl font-medium text-white mb-1">{hasSeen ? 'New to both of you' : 'Your matches'}</h1>
        <p className="text-xs text-white/30">
          {hasSeen
            ? `${activeShared.length + activeSolo.length} title${activeShared.length + activeSolo.length !== 1 ? 's' : ''} left`
            : revealMessage.current}
        </p>
      </div>

      {!hasSeen && sharedGenres.length > 0 && (
        <div className="mx-5 mb-4">
          <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2 font-medium">You both want</p>
          <div className="flex flex-wrap gap-2">
            {sharedGenres.map(id => {
              const label = GENRES.find(g => g.id === id || g.tvId === id)?.label;
              return label ? (
                <div key={id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/8 border border-white/15">
                  <i className="ti ti-check text-white/50 text-xs" aria-hidden="true" />
                  <span className="text-xs text-white/70 font-medium">{label}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}

      {!hasSeen && (
        <div className="flex items-center gap-2 px-5 mb-4">
          <i className="ti ti-arrow-left text-white/30 text-sm" aria-hidden="true" />
          <span className="text-xs text-white/35">swipe left — seen it</span>
          <span className="text-white/15 mx-1">·</span>
          <i className="ti ti-arrow-right text-white/30 text-sm" aria-hidden="true" />
          <span className="text-xs text-white/35">swipe right — shortlist</span>
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
            You've seen <span className="text-white/50">{seenTitles.length} title{seenTitles.length !== 1 ? 's' : ''}</span> — restore
          </span>
          <i className="ti ti-refresh text-white/20 text-xs ml-auto" aria-hidden="true" />
        </button>
      )}

      <div className="px-5 mt-8 mb-2">
        <button onClick={onReset} className="w-full py-3 rounded-2xl border border-white/10 text-xs text-white/20">Start over</button>
      </div>

      <p className="text-center text-[10px] text-white/10 px-5 pb-6">
        This product uses the TMDB API but is not endorsed or certified by TMDB.
      </p>

      {/* Floating shortlist button — appears once something is saved */}
      {savedTitles.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-5 pointer-events-none">
          <button
            onClick={() => setView('shortlist')}
            className="w-full pointer-events-auto py-3.5 rounded-2xl bg-white text-[#0e0e0e] text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
          >
            <i className="ti ti-heart-filled text-base" aria-hidden="true" />
            Shortlist · {savedTitles.length} title{savedTitles.length !== 1 ? 's' : ''}
          </button>
        </div>
      )}
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
      {/* Single save button — swipe handles seen */}
      <button
        onClick={() => onSave(title.id)}
        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
          title.saved ? 'border-white/40 bg-white/10 text-white scale-110' : 'border-white/10 bg-white/5 text-white/30'
        } ${title.savingAnim ? 'scale-125' : ''}`}
        aria-label="Save to shortlist"
      >
        <i className={`ti ${title.saved ? 'ti-heart-filled' : 'ti-heart'} text-sm`} aria-hidden="true" />
      </button>
    </div>
  );
}
