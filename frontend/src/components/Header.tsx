import { Bell, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-white/80 px-6 backdrop-blur-xl">
      <div className="flex flex-1 items-center justify-end md:justify-between">
        {/* Search */}
        <div className="hidden md:block w-full max-w-md">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              className="block w-full rounded-full border-0 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-primary sm:leading-6 transition-all duration-300 shadow-sm"
              placeholder="Search..."
            />
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center gap-x-4 lg:gap-x-6 shrink-0 ml-auto">
          <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-slate-900 transition-colors relative hover:bg-slate-50 rounded-full">
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200" aria-hidden="true" />

          {/* Profile */}
          <button type="button" className="flex items-center p-1.5 rounded-full hover:bg-slate-50 transition-all outline-none ring-2 ring-transparent focus:ring-primary/50">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white shadow-md shadow-primary/20">
              <User className="h-4 w-4" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
