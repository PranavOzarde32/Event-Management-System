"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, ShoppingBag, Package, Settings, HelpCircle, TicketPercent  } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Bookings', href: '/bookings', icon: ShoppingBag },
  { name: 'Events', href: '/events', icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r border-border shadow-sm z-10">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-border bg-white">
        <TicketPercent className="h-8 w-8 text-primary" />
        <span className="ml-3 text-lg font-bold tracking-tight text-foreground truncate max-w-[160px]" title="Ecommerce System">
          Event Managment
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto bg-white">
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out ${
                  isActive
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto px-4 py-6 space-y-2 border-t border-border bg-white">
          <Link href="#" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <Settings className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-600" />
            Settings
          </Link>
          <Link href="#" className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
            <HelpCircle className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-slate-600" />
            Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
