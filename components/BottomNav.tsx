'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const path = usePathname();
  const isWatch = path === '/watch';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e0e] border-t border-white/10 flex">
      <Link
        href="/"
        className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${!isWatch ? 'text-[#c8f04a]' : 'text-white/30'}`}
      >
        <i className="ti ti-map-pin text-xl" aria-hidden="true" />
        <span className="text-[10px] font-medium">Get out</span>
      </Link>
      <Link
        href="/watch"
        className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${isWatch ? 'text-[#c8f04a]' : 'text-white/30'}`}
      >
        <i className="ti ti-device-tv text-xl" aria-hidden="true" />
        <span className="text-[10px] font-medium">Stay in</span>
      </Link>
    </nav>
  );
}
