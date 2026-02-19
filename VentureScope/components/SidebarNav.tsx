'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, Bell, Calendar, Settings  } from 'lucide-react';


export default function SidebarNav() {
  const pathname = usePathname();

  function isActive(path: string) {
    if (path === '/') return pathname === '/';
    return pathname === path || pathname.startsWith(path + '/');
  }

  function navClass(path: string) {
    return `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg mx-2 transition-colors ${
      isActive(path)
        ? 'bg-blue-50 text-blue-600'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;
  }

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">

      {/* Brand */}
      <div className="px-4 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-violet-500 rounded-[10px] flex items-center justify-center text-white font-extrabold text-base">
            V
          </div>
          <div className="font-bold text-[15px] text-slate-800">VentureScope</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 py-3">
        <Link href="/" className={navClass('/')}><FolderOpen /> All Projects</Link>
        <Link href="/inprogress" className={navClass('/inprogress')}><Bell /> In Progress</Link>
        <Link href="/exported" className={navClass('/exported')}><Calendar /> Exported</Link>
        <Link href="/settings" className={navClass('/settings')}><Settings  /> Settings</Link>
      </nav>

    </aside>
  );
}
