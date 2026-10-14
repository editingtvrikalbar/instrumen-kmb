import React, { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Clapperboard, 
  Share2, 
  UserCheck
} from 'lucide-react';
import { ProduksiItem, DistribusiItem } from '../types';
import { formatIndonesianDate } from '../utils/storage';

interface KalenderViewProps {
  produksiList: ProduksiItem[];
  distribusiList: DistribusiItem[];
  daftarPetugas: string[];
}

export const KalenderView: React.FC<KalenderViewProps> = ({
  produksiList,
  distribusiList,
  daftarPetugas
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Jump to today
  const handleToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  // Step day
  const handleStepDay = (delta: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + delta);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  // Match items for the selected day
  const dailyAgenda = useMemo(() => {
    // Gather all events for this day
    const prodItems = produksiList.filter(
      i => i.tglRencana === selectedDate || i.tglReal === selectedDate
    );
    const distItems = distribusiList.filter(
      d => d.tglRencana === selectedDate || d.tglAktual === selectedDate
    );

    // Group or list by crew
    return daftarPetugas.map(petugas => {
      const pForPetugas = prodItems.filter(i => i.petugas === petugas);
      const dForPetugas = distItems.filter(d => d.petugas === petugas);

      return {
        petugas,
        hasActivity: pForPetugas.length > 0 || dForPetugas.length > 0,
        produksi: pForPetugas,
        distribusi: dForPetugas
      };
    });
  }, [produksiList, distribusiList, selectedDate, daftarPetugas]);

  const allDayActivities = useMemo(() => {
    const prod = produksiList.filter(
      i => i.tglRencana === selectedDate || i.tglReal === selectedDate
    );
    const dist = distribusiList.filter(
      d => d.tglRencana === selectedDate || d.tglAktual === selectedDate
    );
    return { prod, dist, total: prod.length + dist.length };
  }, [produksiList, distribusiList, selectedDate]);

  return (
    <div className="space-y-6">
      {/* Date Header Controller */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#001838]">
            Kalender & Agenda Kerja Harian
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pemantauan harian jadwal liputan, editing, serta jam tayang konten media baru
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStepDay(-1)}
            className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Hari Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
          />

          <button
            onClick={() => handleStepDay(1)}
            className="p-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Hari Berikutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Hari Ini
          </button>
        </div>
      </div>

      {/* Daily Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500">Tanggal Terpilih</span>
            <p className="text-sm font-bold text-[#001838] mt-0.5">
              {formatIndonesianDate(selectedDate)}
            </p>
          </div>
          <CalendarDays className="w-6 h-6 text-blue-600 opacity-60" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500">Agenda Produksi</span>
            <p className="text-sm font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {allDayActivities.prod.length} Item Pekerjaan
            </p>
          </div>
          <Clapperboard className="w-6 h-6 text-red-600 opacity-60" />
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-slate-500">Jadwal Publikasi Sosmed</span>
            <p className="text-sm font-bold text-emerald-600 font-mono tabular-nums mt-0.5">
              {allDayActivities.dist.length} Konten Tayang
            </p>
          </div>
          <Share2 className="w-6 h-6 text-emerald-600 opacity-60" />
        </div>
      </div>

      {/* Main Agenda Table by Crew */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-900" />
            <h4 className="font-bold text-xs text-[#001838]">
              Daftar Penugasan & Aktivitas Petugas ({formatIndonesianDate(selectedDate)})
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            {allDayActivities.total} total agenda terjadwal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase border-b border-slate-200 tracking-wider">
              <tr>
                <th className="p-3.5 font-semibold w-48">Nama Petugas</th>
                <th className="p-3.5 font-semibold">Aktivitas Rencana Produksi</th>
                <th className="p-3.5 font-semibold">Status Realisasi Produksi</th>
                <th className="p-3.5 font-semibold">Agenda Publikasi Medsos</th>
                <th className="p-3.5 font-semibold">Status Tayang</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dailyAgenda.map(item => (
                <tr key={item.petugas} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-bold text-[#001838] align-top">
                    {item.petugas}
                  </td>

                  {/* Produksi Rencana */}
                  <td className="p-3.5 align-top">
                    {item.produksi.length > 0 ? (
                      <div className="space-y-1.5">
                        {item.produksi.map(p => (
                          <div key={p.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                            <p className="font-semibold text-slate-800">{p.judul}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                              <span className="font-mono">{p.noPekerjaan}</span>
                              <span>·</span>
                              <span>{p.jenis}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Tidak ada jadwal produksi</span>
                    )}
                  </td>

                  {/* Status Produksi */}
                  <td className="p-3.5 align-top">
                    {item.produksi.length > 0 ? (
                      <div className="space-y-1.5">
                        {item.produksi.map(p => (
                          <div key={p.id} className="pt-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                p.status === 'Selesai'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : p.status === 'Dalam Proses'
                                  ? 'bg-amber-100 text-amber-800'
                                  : p.status === 'Tertunda'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  {/* Publikasi */}
                  <td className="p-3.5 align-top">
                    {item.distribusi.length > 0 ? (
                      <div className="space-y-1.5">
                        {item.distribusi.map(d => (
                          <div key={d.id} className="p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                            <p className="font-semibold text-blue-950">{d.judul}</p>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-blue-700">
                              <span className="font-bold">{d.platform}</span>
                              <span>·</span>
                              <span>{d.format}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Tidak ada jadwal publikasi</span>
                    )}
                  </td>

                  {/* Status Publikasi */}
                  <td className="p-3.5 align-top">
                    {item.distribusi.length > 0 ? (
                      <div className="space-y-1.5">
                        {item.distribusi.map(d => (
                          <div key={d.id} className="pt-2">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                                d.status === 'Dipublikasikan'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : d.status === 'Terjadwal'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {d.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
