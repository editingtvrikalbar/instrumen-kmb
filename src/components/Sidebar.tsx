import React from 'react';
import { 
  LayoutDashboard, 
  Clapperboard, 
  Share2, 
  CalendarDays, 
  FileText, 
  Settings, 
  LogOut, 
  X,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { TabType, UserSession } from '../types';
import { TvriLogo } from './TvriLogo';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isOpen: boolean;
  onClose: () => void;
  session: UserSession;
  onLogout: () => void;
  totalProduksiCount: number;
  totalDistribusiCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  session,
  onLogout,
  totalProduksiCount,
  totalDistribusiCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard Eksekutif',
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      id: 'produksi' as TabType,
      label: 'Produksi Konten',
      icon: Clapperboard,
      badge: totalProduksiCount,
      adminOnly: false,
    },
    {
      id: 'distribusi' as TabType,
      label: 'Distribusi Sosmed',
      icon: Share2,
      badge: totalDistribusiCount,
      adminOnly: false,
    },
    {
      id: 'kalender' as TabType,
      label: 'Kalender & Agenda',
      icon: CalendarDays,
      adminOnly: false,
    },
    {
      id: 'laporan' as TabType,
      label: 'Laporan Kinerja',
      icon: FileText,
      adminOnly: false,
    },
    {
      id: 'pengaturan' as TabType,
      label: 'Target & Sistem',
      icon: Settings,
      adminOnly: true,
    },
  ];

  const visibleNavItems = navItems.filter(item => !item.adminOnly || session.role === 'admin');

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-[#001838] via-[#00224f] to-[#00142b] text-white flex flex-col border-r border-blue-900/50 shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-blue-900/60 flex items-center justify-between">
          <TvriLogo size="md" />
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-900/50 transition-colors"
            title="Tutup Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Title */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-semibold text-blue-300/70 tracking-wider uppercase">
            Menu Operasional
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {visibleNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md shadow-red-950/40 font-semibold'
                    : 'text-blue-100 hover:bg-blue-900/40 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {typeof item.badge === 'number' && (
                    <span
                      className={`text-[10px] tabular-nums font-semibold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-red-900/80 text-white'
                          : 'bg-blue-950 text-blue-200 border border-blue-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Station Info Box */}
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-blue-950/50 border border-blue-800/40 text-[11px] text-blue-200/90 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-white text-xs mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>TVRI Stasiun Kalbar</span>
          </div>
          <p className="text-[10px] text-blue-300">
            Seksi Media Baru & Konten Digital
          </p>
          <p className="text-[9px] text-blue-400/80 mt-1">
            Pontianak, Kalimantan Barat
          </p>
        </div>

        {/* User Session Footer */}
        <div className="p-4 border-t border-blue-900/60 bg-[#00142b]/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 border border-blue-400/40 flex items-center justify-center font-bold text-white text-xs shadow-inner shrink-0">
                {session.role === 'admin' ? (
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                ) : (
                  <User className="w-4 h-4 text-blue-100" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {session.petugasName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={`inline-block text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                      session.role === 'admin'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                        : 'bg-blue-400/20 text-blue-200 border border-blue-400/30'
                    }`}
                  >
                    {session.role === 'admin' ? 'Administrator' : 'Kru Petugas'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-200 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
};
