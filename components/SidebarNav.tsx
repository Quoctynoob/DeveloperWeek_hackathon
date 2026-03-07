'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChartColumnBig, Database, Calendar, Settings, CircleQuestionMark, LayoutDashboard, Users, Circle, LayoutList  } from 'lucide-react';


export default function SidebarNav() {
  const pathname = usePathname();

  function isActive(path: string) {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/');
  }

  function navClass(path: string) {
    return `flex flex-col items-center gap-0.5 px-2 py-2 text-xs rounded-lg mx-3 transition-colors ${
      isActive(path)
        ? 'bg-gray-bar font-bold text-white'
        : 'text-white hover:bg-gray-bar hover:text-white'
    }`;
  }

  function iconStroke(path: string) {
    return isActive(path) ? 2 : 1;
  }

  return (
    <aside className="w-24 bg-gray-bg border-r border-slate-200 flex flex-col shrink-0">

      {/* Brand */}
      <div className="px-3 pt-4 pb-3">
        <div className="flex items-center justify-center">
          <Link href="/"><img src="/favicon.ico" alt="lito.ai" className="w-9 h-9 border" /></Link>
        </div>
        <div className='text-white text-center text-xs'>lito.ai</div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 py-2 flex-1">
        <Link href="/" className={navClass('/')}><LayoutDashboard strokeWidth={iconStroke('/')} /> Dashboard</Link>
        <Link href="/analytics" className={navClass('/analytics')}><ChartColumnBig strokeWidth={iconStroke('/analytics')} /> Analytics</Link>
        <Link href="/portfolio" className={navClass('/portfolio')}><LayoutList strokeWidth={iconStroke('/portfolio')} /> Portfolio</Link>
        <Link href="/library" className={navClass('/library')}><Database strokeWidth={iconStroke('/library')} /> Library</Link>

        <div className="flex-1" />

        <Link href="/settings" className={navClass('/settings')}><Settings strokeWidth={iconStroke('/settings')} /> Settings</Link>
        <Link href="/help" className={navClass('/help')}><CircleQuestionMark strokeWidth={iconStroke('/help')} /> Get Help</Link>
        <Link href="/team" className={navClass('/team')}><Users strokeWidth={iconStroke('/team')} /> Team</Link>
        <Link href="/icon" className={navClass('/icon')}><Circle strokeWidth={iconStroke('/icon')} className='fill-amber-600 w-9 h-9'/></Link>
      </nav>

    </aside>
  );
}
