import React, { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  Clapperboard, 
  Share2, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Filter, 
  CheckCircle2, 
  Award,
  ExternalLink
} from 'lucide-react';
import { ProduksiItem, DistribusiItem, GlobalSettings } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardViewProps {
  produksiList: ProduksiItem[];
  distribusiList: DistribusiItem[];
  daftarPetugas: string[];
  settings: GlobalSettings;
  onNavigateToTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  produksiList,
  distribusiList,
  daftarPetugas,
  settings,
  onNavigateToTab
}) => {
  const [filterPeriode, setFilterPeriode] = useState<string>('semua');
  const [filterPetugas, setFilterPetugas] = useState<string>('');

  // Apply filters
  const filteredProduksi = useMemo(() => {
    return produksiList.filter(item => {
      if (filterPetugas && item.petugas !== filterPetugas) return false;
      if (filterPeriode === 'hari_ini') {
        const today = new Date().toISOString().split('T')[0];
        return item.tglRencana === today || item.tglReal === today;
      }
      return true;
    });
  }, [produksiList, filterPetugas, filterPeriode]);

  const filteredDistribusi = useMemo(() => {
    return distribusiList.filter(item => {
      if (filterPetugas && item.petugas !== filterPetugas) return false;
      if (filterPeriode === 'hari_ini') {
        const today = new Date().toISOString().split('T')[0];
        return item.tglRencana === today || item.tglAktual === today;
      }
      return true;
    });
  }, [distribusiList, filterPetugas, filterPeriode]);

  // Statistics
  const stats = useMemo(() => {
    const targetProd = settings.targetProduksi || 50;
    const realProd = filteredProduksi.reduce(
      (acc, curr) => acc + (curr.status === 'Selesai' ? curr.jumlahAktual || 1 : 0),
      0
    );
    const targetPub = settings.targetPublikasi || 150;
    const realPub = filteredDistribusi.filter(i => i.status === 'Dipublikasikan').length;

    const persenProd = targetProd > 0 ? Math.round((realProd / targetProd) * 100) : 0;
    const persenPub = targetPub > 0 ? Math.round((realPub / targetPub) * 100) : 0;

    const prosesCount = filteredProduksi.filter(
      i => i.status === 'Dalam Proses' || i.status === 'Direncanakan'
    ).length;
    const tertundaCount = filteredProduksi.filter(i => i.status === 'Tertunda').length;

    return {
      targetProd,
      realProd,
      persenProd,
      targetPub,
      realPub,
      persenPub,
      prosesCount,
      tertundaCount
    };
  }, [filteredProduksi, filteredDistribusi, settings]);

  // Team recap table
  const rekapTim = useMemo(() => {
    return daftarPetugas.map(nama => {
      const pItems = produksiList.filter(i => i.petugas === nama);
      const dItems = distribusiList.filter(i => i.petugas === nama);

      const targetP = pItems.reduce((acc, curr) => acc + curr.targetJumlah, 0) || 10;
      const realP = pItems.reduce(
        (acc, curr) => acc + (curr.status === 'Selesai' ? curr.jumlahAktual || 1 : 0),
        0
      );
      const persenP = targetP > 0 ? Math.round((realP / targetP) * 100) : 0;

      const targetD = 25; // standard target per kru
      const realD = dItems.filter(i => i.status === 'Dipublikasikan').length;
      const persenD = targetD > 0 ? Math.round((realD / targetD) * 100) : 0;

      return {
        nama,
        targetP,
        realP,
        persenP,
        targetD,
        realD,
        persenD,
        yt: dItems.filter(i => i.platform === 'YouTube' && i.status === 'Dipublikasikan').length,
        ig: dItems.filter(i => i.platform === 'Instagram' && i.status === 'Dipublikasikan').length,
        fb: dItems.filter(i => i.platform === 'Facebook' && i.status === 'Dipublikasikan').length,
        tt: dItems.filter(i => i.platform === 'TikTok' && i.status === 'Dipublikasikan').length,
        x: dItems.filter(i => i.platform === 'X' && i.status === 'Dipublikasikan').length
      };
    });
  }, [daftarPetugas, produksiList, distribusiList]);

  // Chart 1: Produksi Rencana vs Realisasi Mingguan
  const chartProduksiData = {
    labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
    datasets: [
      {
        label: 'Target Produksi',
        data: [12, 13, 12, 13],
        backgroundColor: '#00224f',
        borderRadius: 6
      },
      {
        label: 'Realisasi Selesai',
        data: [
          Math.min(12, Math.max(2, Math.round(stats.realProd * 0.28))),
          Math.min(13, Math.max(3, Math.round(stats.realProd * 0.32))),
          Math.min(12, Math.max(1, Math.round(stats.realProd * 0.22))),
          Math.min(13, Math.max(1, Math.round(stats.realProd * 0.18)))
        ],
        backgroundColor: '#dc2626',
        borderRadius: 6
      }
    ]
  };

  // Chart 2: Publikasi per Platform (Rencana vs Realisasi)
  const platforms = ['YouTube', 'Instagram', 'Facebook', 'TikTok', 'X'] as const;
  const chartPublikasiData = {
    labels: [...platforms],
    datasets: [
      {
        label: 'Target Rencana',
        data: [25, 45, 30, 35, 15],
        backgroundColor: '#cbd5e1',
        borderRadius: 6
      },
      {
        label: 'Realisasi Tayang',
        data: platforms.map(p =>
          distribusiList.filter(i => i.platform === p && i.status === 'Dipublikasikan').length
        ),
        backgroundColor: '#1d4ed8',
        borderRadius: 6
      }
    ]
  };

  // Chart 3: Capaian Produksi per Petugas
  const chartPetugasData = {
    labels: daftarPetugas.slice(0, 6).map(p => p.split(' ')[0]),
    datasets: [
      {
        label: 'Realisasi Selesai',
        data: daftarPetugas.slice(0, 6).map(nama =>
          produksiList
            .filter(i => i.petugas === nama && i.status === 'Selesai')
            .reduce((a, c) => a + (c.jumlahAktual || 1), 0)
        ),
        backgroundColor: '#059669',
        borderRadius: 6
      }
    ]
  };

  // Chart 4: Distribusi Platform (Doughnut)
  const chartPlatformData = {
    labels: ['YouTube', 'Instagram', 'Facebook', 'TikTok', 'X'],
    datasets: [
      {
        data: platforms.map(p => distribusiList.filter(i => i.platform === p).length || 1),
        backgroundColor: ['#dc2626', '#e1306c', '#1877f2', '#111827', '#475569'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          font: { size: 11, family: 'Plus Jakarta Sans' }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: { font: { size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: 10 } }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 10,
          font: { size: 11, family: 'Plus Jakarta Sans' }
        }
      }
    },
    cutout: '65%'
  };

  return (
    <div className="space-y-6">
      {/* Filter Global Bar */}
      <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-700">Periode:</span>
            <select
              value={filterPeriode}
              onChange={e => setFilterPeriode(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="semua">Semua Waktu (Tahun 2026)</option>
              <option value="hari_ini">Hari Ini</option>
              <option value="minggu_ini">Minggu Ini</option>
              <option value="bulan_ini">Bulan Berjalan</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Petugas:</span>
            <select
              value={filterPetugas}
              onChange={e => setFilterPetugas(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
            >
              <option value="">Semua Petugas Media Baru</option>
              {daftarPetugas.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {filterPetugas && (
            <button
              onClick={() => setFilterPetugas('')}
              className="text-xs text-red-600 hover:text-red-700 font-medium underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>
            Sinkronisasi data otomatis dengan Seksi Media Baru TVRI Kalbar
          </span>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Produksi Konten */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Capaian Produksi
              </p>
              <h3 className="text-2xl font-bold text-[#001838] mt-1 tabular-nums">
                {stats.realProd}{' '}
                <span className="text-sm font-normal text-slate-400">
                  / {stats.targetProd}
                </span>
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Clapperboard className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Persentase Target</span>
              <span className="font-bold text-blue-700 tabular-nums">
                {stats.persenProd}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.persenProd)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Capaian Publikasi */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Capaian Publikasi
              </p>
              <h3 className="text-2xl font-bold text-[#001838] mt-1 tabular-nums">
                {stats.realPub}{' '}
                <span className="text-sm font-normal text-slate-400">
                  / {stats.targetPub}
                </span>
              </h3>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Tayang di 5 Platform</span>
              <span className="font-bold text-red-600 tabular-nums">
                {stats.persenPub}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-red-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.persenPub)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Proses & Direncanakan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Dalam Proses / Rencana
              </p>
              <h3 className="text-2xl font-bold text-amber-600 mt-1 tabular-nums">
                {stats.prosesCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Pekerjaan aktif dalam antrean editing & liputan
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigateToTab('produksi')}
              className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Lihat Rincian Produksi</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Card 4: Tertunda / Terlambat */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Tertunda / Kendala
              </p>
              <h3 className="text-2xl font-bold text-red-600 mt-1 tabular-nums">
                {stats.tertundaCount}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Memerlukan konfirmasi narasumber atau bahan
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              Perlu perhatian supervisi KPP
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Produksi vs Target */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#001838]">
                Grafik Target vs Realisasi Produksi Konten
              </h3>
              <p className="text-xs text-slate-500">
                Pencapaian mingguan dalam bulan berjalan
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-64 relative">
            <Bar data={chartProduksiData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 2: Rencana vs Realisasi Platform */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#001838]">
                Grafik Publikasi per Platform Media Sosial
              </h3>
              <p className="text-xs text-slate-500">
                Target rencana publikasi vs realisasi tayang
              </p>
            </div>
            <Share2 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-64 relative">
            <Bar data={chartPublikasiData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Capaian Produksi per Petugas */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#001838]">
                Realisasi Produksi per Petugas
              </h3>
              <p className="text-xs text-slate-500">
                Jumlah konten selesai disunting & diproduksi
              </p>
            </div>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="h-64 relative">
            <Bar data={chartPetugasData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 4: Proporsi Distribusi Platform */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#001838]">
                Proporsi Konten Media Sosial
              </h3>
              <p className="text-xs text-slate-500">
                Distribusi sebaran kanal resmi TVRI Kalimantan Barat
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500 tabular-nums">
              Total {distribusiList.length} Konten
            </span>
          </div>
          <div className="h-64 relative flex items-center justify-center">
            <Doughnut data={chartPlatformData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Rekapitulasi Kinerja Tim Media Baru Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#001838]">
              Rekapitulasi Kinerja Tim Media Baru TVRI Kalbar
            </h3>
            <p className="text-xs text-slate-500">
              Evaluasi komparatif produksi dan distribusi antarkru seksi media baru
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Periode: <span className="font-bold text-[#001838]">{settings.periodeAktif}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 tracking-wider">
              <tr>
                <th className="p-3.5 font-semibold">Nama Petugas</th>
                <th className="p-3.5 text-center font-semibold">Target Prod</th>
                <th className="p-3.5 text-center font-semibold">Real Prod</th>
                <th className="p-3.5 text-center font-semibold">Capaian Prod</th>
                <th className="p-3.5 text-center font-semibold">Target Pub</th>
                <th className="p-3.5 text-center font-semibold">Real Pub</th>
                <th className="p-3.5 text-center font-semibold">Capaian Pub</th>
                <th className="p-3.5 text-center font-semibold text-red-600">YouTube</th>
                <th className="p-3.5 text-center font-semibold text-pink-600">Instagram</th>
                <th className="p-3.5 text-center font-semibold text-blue-600">Facebook</th>
                <th className="p-3.5 text-center font-semibold text-slate-900">TikTok</th>
                <th className="p-3.5 text-center font-semibold text-slate-600">X</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rekapTim.map(p => (
                <tr key={p.nama} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-semibold text-[#001838]">
                    {p.nama}
                  </td>
                  <td className="p-3.5 text-center font-mono tabular-nums text-slate-600">
                    {p.targetP}
                  </td>
                  <td className="p-3.5 text-center font-mono tabular-nums font-bold text-slate-900">
                    {p.realP}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold text-[11px] font-mono tabular-nums ${
                        p.persenP >= 100
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.persenP >= 70
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {p.persenP}%
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-mono tabular-nums text-slate-600">
                    {p.targetD}
                  </td>
                  <td className="p-3.5 text-center font-mono tabular-nums font-bold text-slate-900">
                    {p.realD}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-md font-semibold text-[11px] font-mono tabular-nums ${
                        p.persenD >= 100
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {p.persenD}%
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-mono tabular-nums font-medium">
                    {p.yt}
                  </td>
                  <td className="p-3.5 text-center font-mono tabular-nums font-medium">
                    {p.ig}
                  </td>
                  <td className="p-3.5 text-center font-mono tabular-nums font-medium">
                    {p.fb}
                  </td>
                  <td className="p-3.5 text-center font-mono tabular-nums font-medium">
                    {p.tt}
                  </td>
                  <td className="p-3.5 text-center font-mono tabular-nums font-medium">
                    {p.x}
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
