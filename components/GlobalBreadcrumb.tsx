'use client';

import { usePathname } from 'next/navigation';
import { House, FolderPlus, Send, ClipboardList } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type CrumbMeta = { label: string; icon?: React.ReactNode };

const SEGMENT_META: Record<string, CrumbMeta> = {
  'project-intake': { label: 'Project Intake', icon: <FolderPlus className="w-3.5 h-3.5" /> },
  'review':         { label: 'Review',          icon: <Send     className="w-3.5 h-3.5" /> },
  'results':        { label: 'Report',          icon: <ClipboardList className="w-3.5 h-3.5" /> },
};

const HOME: CrumbMeta = { label: 'All Projects', icon: <House className="w-3.5 h-3.5" /> };

function CrumbContent({ label, icon }: CrumbMeta) {
  return (
    <span className="flex items-center gap-1.5">
      {icon}
      {label}
    </span>
  );
}

export default function GlobalBreadcrumb() {
  const pathname = usePathname();

  const segments = pathname.split('/').filter(Boolean);

  const crumbs: (CrumbMeta & { href: string })[] = [
    { ...HOME, href: '/' },
    ...segments.map((seg, i) => ({
      ...(SEGMENT_META[seg] ?? { label: seg }),
      href: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <BreadcrumbItem key={crumb.href}>
              {isLast ? (
                <BreadcrumbPage><CrumbContent label={crumb.label} icon={crumb.icon} /></BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}><CrumbContent label={crumb.label} icon={crumb.icon} /></BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        }).reduce<React.ReactNode[]>((acc, item, i) => {
          if (i === 0) return [item];
          return [...acc, <BreadcrumbSeparator key={`sep-${i}`} />, item];
        }, [])}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
