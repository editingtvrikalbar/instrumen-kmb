import React from 'react';
import { Menu, Calendar, Plus, Clapperboard, Share2 } from 'lucide-react';
import { TabType, UserSession } from '../types';
import { formatFullIndonesianDate } from '../utils/storage';

interface HeaderProps {
  currentTab: TabType;
  onOpenSidebar: () => void;
  session: UserSession;
  onOpenProduksiModal: () => void;
  onOpenDistribusiModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSidebar,
  session,
  onOpenProduksiModal,
  onOpenDistribusiModal
}) => {
  const getTabInfo = () => {
    switch (currentTab) {
      case 'dashboard':
        return {
          title: 'INSTRUMEN KONTEN MEDIA BARU',
          subtitle: 'Dashboard Monitoring & Analisis Capaian Kinerja'
        };
      case 'produksi':
        return {
          title: 'PRODUKSI & RENCANA KONTEN',
          subtitle: 'Manajemen Penugasan, Jadwal, dan Realisasi Liputan'
        };
      case 'distribusi':
        return {
          title: 'DISTRIBUSI MEDIA SOSIAL',
          subtitle: 'Publikasi Multiplatform (YouTube, Instagram, Facebook, TikTok, X)'
        };
      case 'kalender':
        return {
          title: 'KALENDER & AGENDA KERJA',
          subtitle: 'Jadwal Harian Perencanaan, Liputan, dan Penayangan'
        };
      case 'laporan':
        return {
          title: 'PELAPORAN & REKAPITULASI KINERJA',
          subtitle: 'Cetak Laporan Resmi Seksi Media Baru TVRI Kalbar'
        };
      case 'pengaturan':
        return {
          title: 'PENGATURAN TARGET & SISTEM',
          subtitle: 'Konfigurasi Target Bulanan dan Daftar Petugas Media Baru'
        };
      default:
        return {
          title: 'TVRI KALBAR MEDIA BARU',
          subtitle: 'Instrumen Konten Media Baru'
        };
    }
  };

  const info = getTabInfo();
  const todayFormatted = formatFullIndonesianDate();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Buka navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-bold text-[#001838] tracking-tight truncate uppercase">
              {info.title}
            </h2>
            <p className="text-[11px] text-slate-500 hidden sm:block truncate">
              {info.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Date Badge & Quick Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Indonesian Date */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-900 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span className="capitalize">{todayFormatted}</span>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenProduksiModal}
              className="px-3 py-1.5 bg-[#00224f] hover:bg-[#001838] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
              title="Buat Rencana / Produksi Baru"
            >
              <Clapperboard className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Rencana Baru</span>
              <Plus className="w-3.5 h-3.5 sm:hidden" />
            </button>

            <button
              onClick={onOpenDistribusiModal}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
              title="Catat Publikasi Media Sosial"
            >
              <Share2 className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Catat Publikasi</span>
              <Plus className="w-3.5 h-3.5 sm:hidden" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
