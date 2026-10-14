import React, { useMemo } from 'react';
import { 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  CheckCircle2, 
  Building2,
  Calendar
} from 'lucide-react';
import { ProduksiItem, DistribusiItem, GlobalSettings, UserSession } from '../types';
import { formatFullIndonesianDate, exportToCSV } from '../utils/storage';
import { TvriLogo } from './TvriLogo';

interface LaporanViewProps {
  produksiList: ProduksiItem[];
  distribusiList: DistribusiItem[];
  daftarPetugas: string[];
  settings: GlobalSettings;
  session: UserSession;
}

export const LaporanView: React.FC<LaporanViewProps> = ({
  produksiList,
  distribusiList,
  daftarPetugas,
  settings,
  session
}) => {
  const currentDate = formatFullIndonesianDate();

  // Statistics
  const stats = useMemo(() => {
    const targetProd = settings.targetProduksi || 50;
    const realProd = produksiList.reduce(
      (acc, curr) => acc + (curr.status === 'Selesai' ? curr.jumlahAktual || 1 : 0),
      0
    );
    const targetPub = settings.targetPublikasi || 150;
    const realPub = distribusiList.filter(i => i.status === 'Dipublikasikan').length;

    const persenProd = targetProd > 0 ? Math.round((realProd / targetProd) * 100) : 0;
    const persenPub = targetPub > 0 ? Math.round((realPub / targetPub) * 100) : 0;

    return { targetProd, realProd, persenProd, targetPub, realPub, persenPub };
  }, [produksiList, distribusiList, settings]);

  // Rekap Tim
  const rekapPetugas = useMemo(() => {
    return daftarPetugas.map(nama => {
      const pItems = produksiList.filter(i => i.petugas === nama);
      const dItems = distribusiList.filter(i => i.petugas === nama);

      const targetP = pItems.reduce((acc, curr) => acc + curr.targetJumlah, 0) || 10;
      const realP = pItems.reduce(
        (acc, curr) => acc + (curr.status === 'Selesai' ? curr.jumlahAktual || 1 : 0),
        0
      );
      const persenP = targetP > 0 ? Math.round((realP / targetP) * 100) : 0;

      const targetD = 25;
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
        x: dItems.filter(i => i.platform === 'X' && i.status === 'Dipublikasikan').length,
      };
    });
  }, [daftarPetugas, produksiList, distribusiList]);

  // Breakdown by platform
  const platformBreakdown = useMemo(() => {
    const plats = ['YouTube', 'Instagram', 'Facebook', 'TikTok', 'X'] as const;
    return plats.map(plat => {
      const items = distribusiList.filter(i => i.platform === plat);
      const tayang = items.filter(i => i.status === 'Dipublikasikan').length;
      const views = items.reduce((a, c) => a + (c.views || 0), 0);
      return { platform: plat, total: items.length, tayang, views };
    });
  }, [distribusiList]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Nama Petugas',
      'Target Produksi',
      'Realisasi Produksi',
      'Persen Produksi',
      'Target Publikasi',
      'Realisasi Publikasi',
      'Persen Publikasi',
      'YouTube',
      'Instagram',
      'Facebook',
      'TikTok',
      'X (Twitter)'
    ];

    const rows = rekapPetugas.map(p => [
      p.nama,
      p.targetP,
      p.realP,
      `${p.persenP}%`,
      p.targetD,
      p.realD,
      `${p.persenD}%`,
      p.yt,
      p.ig,
      p.fb,
      p.tt,
      p.x
    ]);

    exportToCSV(`Laporan_Kinerja_TVRI_Kalbar_${new Date().toISOString().split('T')[0]}.csv`, rows, headers);
  };

  return (
    <div className="space-y-6">
      {/* Actions Toolbar - Hidden during print */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <h3 className="text-base font-bold text-[#001838]">
            Pelaporan & Rekapitulasi Kinerja
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumen resmi evaluasi berkala capaian produksi dan publikasi media baru
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#001838] hover:bg-[#00224f] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Resmi</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Unduh Excel (CSV)</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Official Formatted Printable Document */}
      <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs max-w-4xl mx-auto printable-document">
        {/* Official Letterhead (KOP SURAT) */}
        <div className="border-b-4 border-double border-[#001838] pb-4 mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="shrink-0">
              <TvriLogo size="lg" lightText={false} />
            </div>

            <div className="text-center flex-1">
              <h2 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wider uppercase">
                LEMBAGA PENYIARAN PUBLIK TELEVISI REPUBLIK INDONESIA
              </h2>
              <h1 className="text-base sm:text-xl font-extrabold text-[#001838] tracking-tight uppercase">
                STASIUN KALIMANTAN BARAT
              </h1>
              <p className="text-xs font-semibold text-red-600 tracking-wide uppercase mt-0.5">
                SEKSI MEDIA BARU & KONTEN DIGITAL
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {settings.alamatStasiun} · Surel: tvrikalbarediting@gmail.com
              </p>
            </div>

            <div className="w-14 hidden sm:block"></div>
          </div>
        </div>

        {/* Report Document Title */}
        <div className="text-center my-6">
          <h3 className="text-base font-bold text-[#001838] uppercase underline underline-offset-4 tracking-wide">
            LAPORAN KINERJA OPERASIONAL SEKSI MEDIA BARU
          </h3>
          <p className="text-xs font-medium text-slate-600 mt-1">
            Periode Evaluasi: <span className="font-bold text-slate-900">{settings.periodeAktif}</span>
          </p>
        </div>

        {/* Section 1: Ringkasan Capaian Utama */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-[#001838] uppercase border-b border-slate-200 pb-1">
            I. Ringkasan Capaian Indikator Kinerja Utama (IKU)
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Target Produksi
              </span>
              <p className="text-base font-bold text-[#001838] font-mono tabular-nums mt-0.5">
                {stats.targetProd} Konten
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Realisasi Produksi
              </span>
              <p className="text-base font-bold text-emerald-600 font-mono tabular-nums mt-0.5">
                {stats.realProd} Konten ({stats.persenProd}%)
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Target Publikasi
              </span>
              <p className="text-base font-bold text-[#001838] font-mono tabular-nums mt-0.5">
                {stats.targetPub} Tayangan
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                Realisasi Publikasi
              </span>
              <p className="text-base font-bold text-red-600 font-mono tabular-nums mt-0.5">
                {stats.realPub} Tayangan ({stats.persenPub}%)
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Rekapitulasi per Petugas */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold text-[#001838] uppercase border-b border-slate-200 pb-1">
            II. Rekapitulasi Kinerja Anggota Tim Media Baru
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-2.5 border border-slate-300">Nama Petugas</th>
                  <th className="p-2.5 text-center border border-slate-300">Target Prod</th>
                  <th className="p-2.5 text-center border border-slate-300">Real Prod</th>
                  <th className="p-2.5 text-center border border-slate-300">Capaian (%)</th>
                  <th className="p-2.5 text-center border border-slate-300">Target Pub</th>
                  <th className="p-2.5 text-center border border-slate-300">Real Pub</th>
                  <th className="p-2.5 text-center border border-slate-300">Capaian (%)</th>
                </tr>
              </thead>
              <tbody>
                {rekapPetugas.map(p => (
                  <tr key={p.nama} className="hover:bg-slate-50">
                    <td className="p-2 border border-slate-300 font-semibold text-slate-800">
                      {p.nama}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono tabular-nums">
                      {p.targetP}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono tabular-nums font-bold">
                      {p.realP}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono tabular-nums">
                      <span className="font-bold text-emerald-700">{p.persenP}%</span>
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono tabular-nums">
                      {p.targetD}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono tabular-nums font-bold">
                      {p.realD}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono tabular-nums">
                      <span className="font-bold text-red-700">{p.persenD}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Sebaran Platform */}
        <div className="space-y-3 mb-8">
          <h4 className="text-xs font-bold text-[#001838] uppercase border-b border-slate-200 pb-1">
            III. Distribusi Kanal Multiplatform Resmi
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-2.5 border border-slate-300">Platform Media Sosial</th>
                  <th className="p-2.5 text-center border border-slate-300">Total Rencana</th>
                  <th className="p-2.5 text-center border border-slate-300">Sudah Dipublikasikan</th>
                  <th className="p-2.5 text-center border border-slate-300">Akumulasi Estimasi Tayang (Views)</th>
                </tr>
              </thead>
              <tbody>
                {platformBreakdown.map(b => (
                  <tr key={b.platform}>
                    <td className="p-2 border border-slate-300 font-semibold text-slate-800">
                      {b.platform}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono tabular-nums">
                      {b.total}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono tabular-nums font-bold text-emerald-700">
                      {b.tayang}
                    </td>
                    <td className="p-2 border border-slate-300 text-center font-mono tabular-nums">
                      {b.views.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Signatures Block */}
        <div className="pt-6 border-t border-slate-300 flex items-start justify-between text-xs text-slate-700">
          <div>
            <p>Mengetahui,</p>
            <p className="font-bold text-[#001838] mt-1">
              Ketua Tim / KPP Media Baru
            </p>
            <p className="text-[10px] text-slate-500">
              LPP TVRI Stasiun Kalimantan Barat
            </p>
            <div className="h-20 flex items-end">
              <div>
                <p className="font-bold text-[#001838] underline">
                  {settings.namaKepalaSeksi}
                </p>
                <p className="text-[10px] text-slate-500 font-mono">
                  NIP. {settings.nipKepalaSeksi}
                </p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p>Pontianak, {currentDate}</p>
            <p className="font-bold text-[#001838] mt-1">
              Petugas Pelapor Operasional
            </p>
            <p className="text-[10px] text-slate-500">
              Seksi Media Baru & Konten Digital
            </p>
            <div className="h-20 flex items-end justify-end">
              <div>
                <p className="font-bold text-[#001838] underline">
                  {session.petugasName}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">
                  {session.role === 'admin' ? 'Supervisi / Administrator' : 'Kru Pelaksana'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote / Disclaimer */}
        <div className="mt-8 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-400">
          Dokumen ini dicetak otomatis melalui Instrumen Konten Media Baru LPP TVRI Stasiun Kalimantan Barat.
        </div>
      </div>
    </div>
  );
};
