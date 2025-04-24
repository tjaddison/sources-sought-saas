'use client' // Needed for Logout button interaction

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

// Simple Icons for Demo Navigation
const DashboardIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const MatchingIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>;
const AnalysisIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const ResponseIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const PipelineIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;


export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('demo_authenticated');
    router.push('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { href: '/matching', label: 'Opportunity Matching', icon: <MatchingIcon /> },
    { href: '/analysis', label: 'Analysis (Select Opp First)', icon: <AnalysisIcon /> },
    { href: '/response', label: 'Response Generation (Select Opp First)', icon: <ResponseIcon /> },
    { href: '/pipeline', label: 'Pipeline Management', icon: <PipelineIcon /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-gray-300 flex flex-col fixed h-full">
        <div className="h-16 flex items-center justify-center px-4 bg-gray-900">
           <div className="flex items-center">
             <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
               <rect width="32" height="32" rx="8" fill="#2563EB"/>
               <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
             <span className="text-lg font-semibold text-white">GovWin AI Demo</span>
           </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
             // Basic check for disabled state based on path (improve if needed)
             const isDisabled = (item.href === '/analysis' || item.href === '/response') && !pathname.includes('/matching/') && !pathname.includes('/pipeline/');
             const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

             return (
               <Link
                 key={item.label}
                 href={isDisabled ? '#' : item.href}
                 className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
                   ${isDisabled
                     ? 'text-gray-500 cursor-not-allowed'
                     : isActive
                       ? 'bg-gray-900 text-white'
                       : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                   }`}
                 aria-disabled={isDisabled}
                 tabIndex={isDisabled ? -1 : undefined}
               >
                 {item.icon && <span className="mr-3 flex-shrink-0 h-5 w-5">{item.icon}</span>}
                 {item.label}
               </Link>
             );
          })}
        </nav>
         {/* Logout Button */}
         <div className="p-4 mt-auto border-t border-gray-700">
            <button
                onClick={handleLogout}
                className="group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-700 hover:text-white transition-colors duration-150 ease-in-out"
            >
               <span className="mr-3 flex-shrink-0 h-5 w-5"><LogoutIcon /></span>
               Logout
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 lg:p-10">
        {/* Demo Banner */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6" role="alert">
          <p className="font-bold">Demonstration Environment</p>
          <p>This is a simulated experience. Features are illustrative and do not use live AI or save data permanently.</p>
        </div>
        {children}
      </main>
    </div>
  )
} 