import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Clapperboard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  FileCheck2,
  Calendar
} from 'lucide-react';
import { ProduksiItem, JenisKonten, StatusProduksi } from '../types';
import { formatIndonesianDate, generateNextJobNo } from '../utils/storage';

interface ProduksiViewProps {
  items: ProduksiItem[];
  daftarPetugas: string[];
  currentUser: string;
  userRole: 'admin' | 'petugas';
  onSaveItem: (item: ProduksiItem) => void;
  onDeleteItem: (id: string) => void;
  isOpenModal: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
}

export const ProduksiView: React.FC<ProduksiViewProps> = ({
  items,
  daftarPetugas,
  currentUser,
  userRole,
  onSaveItem,
  onDeleteItem,
  isOpenModal,
  onCloseModal,
  onOpenModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [petugasFilter, setPetugasFilter] = useState<string>('');
  const [jenisFilter, setJenisFilter] = useState<string>('');

  // Editing state
  const [editingItem, setEditingItem] = useState<ProduksiItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<ProduksiItem>({
    id: '',
    noPekerjaan: '',
    petugas: '',
    judul: '',
    jenis: 'Berita',
    tglRencana: new Date().toISOString().split('T')[0],
    targetJumlah: 1,
    tglReal: '',
    jumlahAktual: 0,
    status: 'Direncanakan',
    tautan: '',
    catatan: '',
    createdAt: ''
  });

  const handleOpenAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    setEditingItem(null);
    setFormData({
      id: `prod-${Date.now()}`,
      noPekerjaan: generateNextJobNo(items),
      petugas: userRole === 'petugas' ? currentUser : (daftarPetugas[0] || ''),
      judul: '',
      jenis: 'Berita',
      tglRencana: today,
      targetJumlah: 1,
      tglReal: '',
      jumlahAktual: 0,
      status: 'Direncanakan',
      tautan: '',
      catatan: '',
      createdAt: new Date().toISOString()
    });
    onOpenModal();
  };

  const handleOpenEdit = (item: ProduksiItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    onOpenModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.petugas) return;

    // Auto-fill actual date if status is marked Selesai and empty
    const updated = { ...formData };
    if (updated.status === 'Selesai' && !updated.tglReal) {
      updated.tglReal = new Date().toISOString().split('T')[0];
    }
    if (updated.status === 'Selesai' && updated.jumlahAktual === 0) {
      updated.jumlahAktual = updated.targetJumlah || 1;
    }

    onSaveItem(updated);
    onCloseModal();
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch =
        !searchTerm ||
        item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.noPekerjaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.petugas.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = !statusFilter || item.status === statusFilter;
      const matchPetugas = !petugasFilter || item.petugas === petugasFilter;
      const matchJenis = !jenisFilter || item.jenis === jenisFilter;

      return matchSearch && matchStatus && matchPetugas && matchJenis;
    });
  }, [items, searchTerm, statusFilter, petugasFilter, jenisFilter]);

  const summary = useMemo(() => {
    const total = items.length;
    const selesai = items.filter(i => i.status === 'Selesai').length;
    const proses = items.filter(i => i.status === 'Dalam Proses').length;
    const rencana = items.filter(i => i.status === 'Direncanakan').length;
    const tertunda = items.filter(i => i.status === 'Tertunda').length;
    return { total, selesai, proses, rencana, tertunda };
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#001838]">
            Produksi & Rencana Konten Media Baru
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola penugasan, instruksi kerja liputan, status editing, dan verifikasi hasil konten
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rencana / Produksi</span>
        </button>
      </div>

      {/* Mini KPI Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-slate-500">Total Pekerjaan</span>
            <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">{summary.total}</p>
          </div>
          <Clapperboard className="w-5 h-5 text-blue-600 opacity-60" />
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-slate-500">Selesai Produksi</span>
            <p className="text-lg font-bold text-emerald-600 font-mono tabular-nums">{summary.selesai}</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600 opacity-60" />
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-slate-500">Dalam Proses</span>
            <p className="text-lg font-bold text-amber-600 font-mono tabular-nums">{summary.proses}</p>
          </div>
          <Clock className="w-5 h-5 text-amber-600 opacity-60" />
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-slate-500">Tertunda</span>
            <p className="text-lg font-bold text-red-600 font-mono tabular-nums">{summary.tertunda}</p>
          </div>
          <AlertCircle className="w-5 h-5 text-red-600 opacity-60" />
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul, no job, atau petugas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
          >
            <option value="">Semua Status</option>
            <option value="Direncanakan">Direncanakan</option>
            <option value="Dalam Proses">Dalam Proses</option>
            <option value="Selesai">Selesai</option>
            <option value="Tertunda">Tertunda</option>
          </select>

          {/* Petugas Filter */}
          <select
            value={petugasFilter}
            onChange={e => setPetugasFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
          >
            <option value="">Semua Petugas</option>
            {daftarPetugas.map(p => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Jenis Filter */}
          <select
            value={jenisFilter}
            onChange={e => setJenisFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
          >
            <option value="">Semua Jenis Konten</option>
            <option value="Berita">Berita</option>
            <option value="Feature">Feature</option>
            <option value="Program">Program</option>
            <option value="Liputan">Liputan</option>
            <option value="Video Pendek">Video Pendek</option>
            <option value="Talkshow">Talkshow</option>
            <option value="Live Streaming">Live Streaming</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 shrink-0">
          Menampilkan <span className="font-bold text-slate-800 tabular-nums">{filteredItems.length}</span> dari{' '}
          <span className="font-bold text-slate-800 tabular-nums">{items.length}</span> data
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 tracking-wider">
              <tr>
                <th className="p-3.5 font-semibold">No. Pekerjaan & Tgl</th>
                <th className="p-3.5 font-semibold">Petugas Penanggung Jawab</th>
                <th className="p-3.5 font-semibold">Judul Konten</th>
                <th className="p-3.5 font-semibold">Jenis</th>
                <th className="p-3.5 text-center font-semibold">Target / Aktual</th>
                <th className="p-3.5 text-center font-semibold">Status</th>
                <th className="p-3.5 text-center font-semibold">Tautan</th>
                <th className="p-3.5 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5">
                    <span className="font-mono font-bold text-[#001838] tabular-nums">
                      {item.noPekerjaan}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Rencana: {formatIndonesianDate(item.tglRencana)}
                    </p>
                    {item.tglReal && (
                      <p className="text-[10px] text-emerald-600 font-medium">
                        Selesai: {formatIndonesianDate(item.tglReal)}
                      </p>
                    )}
                  </td>

                  <td className="p-3.5 font-semibold text-slate-700">
                    {item.petugas}
                  </td>

                  <td className="p-3.5 max-w-xs">
                    <p className="font-bold text-[#001838] truncate" title={item.judul}>
                      {item.judul}
                    </p>
                    {item.catatan && (
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 italic">
                        {item.catatan}
                      </p>
                    )}
                  </td>

                  <td className="p-3.5">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-md font-medium text-[11px] border border-blue-100">
                      {item.jenis}
                    </span>
                  </td>

                  <td className="p-3.5 text-center font-mono tabular-nums">
                    <span className="font-bold text-slate-900">{item.jumlahAktual}</span>{' '}
                    <span className="text-slate-400">/ {item.targetJumlah}</span>
                  </td>

                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide ${
                        item.status === 'Selesai'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : item.status === 'Dalam Proses'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : item.status === 'Tertunda'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-center">
                    {item.tautan ? (
                      <a
                        href={item.tautan}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                        title="Buka Tautan Hasil Konten"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Buka</span>
                      </a>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>

                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Pekerjaan"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus pekerjaan ${item.noPekerjaan} (${item.judul})?`)) {
                            onDeleteItem(item.id);
                          }
                        }}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Pekerjaan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    <Clapperboard className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-medium text-slate-600">Tidak ada data produksi ditemukan.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Silakan sesuaikan filter pencarian atau tambahkan rencana pekerjaan baru.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Add / Edit */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Clapperboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#001838]">
                    {editingItem ? 'Edit Data Produksi Konten' : 'Tambah Rencana / Produksi Baru'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Seksi Media Baru LPP TVRI Stasiun Kalimantan Barat
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Pekerjaan
                  </label>
                  <input
                    type="text"
                    value={formData.noPekerjaan}
                    onChange={e => setFormData({ ...formData, noPekerjaan: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-slate-800 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Petugas Penanggung Jawab
                  </label>
                  <select
                    value={formData.petugas}
                    onChange={e => setFormData({ ...formData, petugas: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                  >
                    <option value="">Pilih Petugas</option>
                    {daftarPetugas.map(p => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Judul / Nama Konten
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pesona Wisata Bahari Singkawang & Cap Go Meh"
                  value={formData.judul}
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Konten
                  </label>
                  <select
                    value={formData.jenis}
                    onChange={e => setFormData({ ...formData, jenis: e.target.value as JenisKonten })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Berita">Berita</option>
                    <option value="Feature">Feature</option>
                    <option value="Program">Program</option>
                    <option value="Liputan">Liputan</option>
                    <option value="Video Pendek">Video Pendek</option>
                    <option value="Talkshow">Talkshow</option>
                    <option value="Live Streaming">Live Streaming</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Rencana
                  </label>
                  <input
                    type="date"
                    value={formData.tglRencana}
                    onChange={e => setFormData({ ...formData, tglRencana: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Jumlah
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetJumlah}
                    onChange={e => setFormData({ ...formData, targetJumlah: parseInt(e.target.value) || 1 })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Pekerjaan
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as StatusProduksi })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Direncanakan">Direncanakan</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Tertunda">Tertunda</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Selesai (Realisasi)
                  </label>
                  <input
                    type="date"
                    value={formData.tglReal}
                    onChange={e => setFormData({ ...formData, tglReal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jumlah Aktual Selesai
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.jumlahAktual}
                    onChange={e => setFormData({ ...formData, jumlahAktual: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tautan File / Hasil Konten (Google Drive, YouTube, Server)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.tautan}
                  onChange={e => setFormData({ ...formData, tautan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Catatan / Keterangan Narasumber & Tim
                </label>
                <textarea
                  rows={2}
                  placeholder="Informasi tambahan, lokasi shooting, kendala, atau arahan produser..."
                  value={formData.catatan}
                  onChange={e => setFormData({ ...formData, catatan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onCloseModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-xs transition-colors"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Simpan Pekerjaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
