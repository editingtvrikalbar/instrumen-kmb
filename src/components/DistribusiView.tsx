import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Share2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  Eye,
  ThumbsUp,
  Video,
  Radio
} from 'lucide-react';
import { DistribusiItem, PlatformSosmed, StatusDistribusi } from '../types';
import { formatIndonesianDate } from '../utils/storage';

interface DistribusiViewProps {
  items: DistribusiItem[];
  daftarPetugas: string[];
  currentUser: string;
  userRole: 'admin' | 'petugas';
  onSaveItem: (item: DistribusiItem) => void;
  onDeleteItem: (id: string) => void;
  isOpenModal: boolean;
  onCloseModal: () => void;
  onOpenModal: () => void;
}

export const DistribusiView: React.FC<DistribusiViewProps> = ({
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
  const [activePlatform, setActivePlatform] = useState<string>('semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [petugasFilter, setPetugasFilter] = useState<string>('');

  // Editing state
  const [editingItem, setEditingItem] = useState<DistribusiItem | null>(null);

  // Form state
  const [formData, setFormData] = useState<DistribusiItem>({
    id: '',
    platform: 'YouTube',
    petugas: '',
    judul: '',
    format: 'Video Panjang',
    tglRencana: new Date().toISOString().split('T')[0],
    tglAktual: '',
    status: 'Terjadwal',
    tautan: '',
    views: 0,
    likes: 0,
    shares: 0,
    catatan: '',
    createdAt: ''
  });

  const handleOpenAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    setEditingItem(null);
    setFormData({
      id: `dist-${Date.now()}`,
      platform: (activePlatform !== 'semua' ? activePlatform : 'YouTube') as PlatformSosmed,
      petugas: userRole === 'petugas' ? currentUser : (daftarPetugas[0] || ''),
      judul: '',
      format: activePlatform === 'TikTok' || activePlatform === 'Instagram' ? 'Reels / Shorts (9:16)' : 'Video Panjang (16:9)',
      tglRencana: today,
      tglAktual: '',
      status: 'Terjadwal',
      tautan: '',
      views: 0,
      likes: 0,
      shares: 0,
      catatan: '',
      createdAt: new Date().toISOString()
    });
    onOpenModal();
  };

  const handleOpenEdit = (item: DistribusiItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    onOpenModal();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.judul.trim() || !formData.petugas) return;

    const updated = { ...formData };
    if (updated.status === 'Dipublikasikan' && !updated.tglAktual) {
      updated.tglAktual = new Date().toISOString().split('T')[0];
    }

    onSaveItem(updated);
    onCloseModal();
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchPlatform = activePlatform === 'semua' || item.platform === activePlatform;
      const matchSearch =
        !searchTerm ||
        item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.petugas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.format.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = !statusFilter || item.status === statusFilter;
      const matchPetugas = !petugasFilter || item.petugas === petugasFilter;

      return matchPlatform && matchSearch && matchStatus && matchPetugas;
    });
  }, [items, activePlatform, searchTerm, statusFilter, petugasFilter]);

  const platformStats = useMemo(() => {
    const subset = activePlatform === 'semua' ? items : items.filter(i => i.platform === activePlatform);
    const total = subset.length;
    const tayang = subset.filter(i => i.status === 'Dipublikasikan').length;
    const jadwal = subset.filter(i => i.status === 'Terjadwal').length;
    const totalViews = subset.reduce((acc, curr) => acc + (curr.views || 0), 0);
    return { total, tayang, jadwal, totalViews };
  }, [items, activePlatform]);

  const platformMeta: Record<PlatformSosmed, { bg: string; text: string; border: string }> = {
    YouTube: { bg: 'bg-red-50 text-red-600', text: 'text-red-600', border: 'border-red-200' },
    Instagram: { bg: 'bg-pink-50 text-pink-600', text: 'text-pink-600', border: 'border-pink-200' },
    Facebook: { bg: 'bg-blue-50 text-blue-600', text: 'text-blue-600', border: 'border-blue-200' },
    TikTok: { bg: 'bg-slate-100 text-slate-900', text: 'text-slate-900', border: 'border-slate-300' },
    X: { bg: 'bg-slate-100 text-slate-700', text: 'text-slate-800', border: 'border-slate-300' },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#001838]">
            Catatan Distribusi Media Sosial TVRI Kalbar
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manajemen penayangan konten di kanal resmi YouTube, Instagram, Facebook, TikTok, dan X
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
          <span>Catat Publikasi Baru</span>
        </button>
      </div>

      {/* Platform Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActivePlatform('semua')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activePlatform === 'semua'
              ? 'bg-[#00224f] text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Semua Platform ({items.length})
        </button>

        <button
          onClick={() => setActivePlatform('YouTube')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activePlatform === 'YouTube'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
          <span>YouTube</span>
          <span className="text-[10px] opacity-80 tabular-nums">
            ({items.filter(i => i.platform === 'YouTube').length})
          </span>
        </button>

        <button
          onClick={() => setActivePlatform('Instagram')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activePlatform === 'Instagram'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-pink-600 inline-block" />
          <span>Instagram</span>
          <span className="text-[10px] opacity-80 tabular-nums">
            ({items.filter(i => i.platform === 'Instagram').length})
          </span>
        </button>

        <button
          onClick={() => setActivePlatform('Facebook')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activePlatform === 'Facebook'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
          <span>Facebook</span>
          <span className="text-[10px] opacity-80 tabular-nums">
            ({items.filter(i => i.platform === 'Facebook').length})
          </span>
        </button>

        <button
          onClick={() => setActivePlatform('TikTok')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activePlatform === 'TikTok'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
          <span>TikTok</span>
          <span className="text-[10px] opacity-80 tabular-nums">
            ({items.filter(i => i.platform === 'TikTok').length})
          </span>
        </button>

        <button
          onClick={() => setActivePlatform('X')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            activePlatform === 'X'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
          <span>X (Twitter)</span>
          <span className="text-[10px] opacity-80 tabular-nums">
            ({items.filter(i => i.platform === 'X').length})
          </span>
        </button>
      </div>

      {/* Platform Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-slate-500">Total Konten Platform</span>
          <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">{platformStats.total}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-slate-500">Sudah Dipublikasikan</span>
          <p className="text-lg font-bold text-emerald-600 font-mono tabular-nums">{platformStats.tayang}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-slate-500">Terjadwal Tayang</span>
          <p className="text-lg font-bold text-blue-600 font-mono tabular-nums">{platformStats.jadwal}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-slate-500">Total Estimasi Tayangan</span>
          <p className="text-lg font-bold text-[#001838] font-mono tabular-nums">
            {platformStats.totalViews.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari judul konten atau petugas..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
          >
            <option value="">Semua Status Publikasi</option>
            <option value="Terjadwal">Terjadwal</option>
            <option value="Dipublikasikan">Dipublikasikan</option>
            <option value="Tertunda">Tertunda</option>
          </select>

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
        </div>

        <div className="text-xs text-slate-500">
          Total data: <span className="font-bold text-slate-800 tabular-nums">{filteredItems.length}</span>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 tracking-wider">
              <tr>
                <th className="p-3.5 font-semibold">Platform</th>
                <th className="p-3.5 font-semibold">Petugas</th>
                <th className="p-3.5 font-semibold">Judul Konten</th>
                <th className="p-3.5 font-semibold">Format</th>
                <th className="p-3.5 font-semibold">Tgl Rencana / Aktual</th>
                <th className="p-3.5 text-center font-semibold">Status</th>
                <th className="p-3.5 text-center font-semibold">Estimasi Tayang</th>
                <th className="p-3.5 text-center font-semibold">Tautan</th>
                <th className="p-3.5 text-center font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => {
                const meta = platformMeta[item.platform] || {
                  bg: 'bg-slate-100 text-slate-800',
                  text: 'text-slate-800',
                  border: 'border-slate-200'
                };
                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md font-bold text-[11px] border ${meta.bg} ${meta.border}`}
                      >
                        {item.platform}
                      </span>
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
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium">
                        {item.format}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <p className="text-slate-700 font-medium">
                        {formatIndonesianDate(item.tglRencana)}
                      </p>
                      {item.tglAktual ? (
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          Tayang: {formatIndonesianDate(item.tglAktual)}
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400 mt-0.5">Belum tayang</p>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide ${
                          item.status === 'Dipublikasikan'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : item.status === 'Terjadwal'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-3.5 text-center font-mono tabular-nums text-slate-700">
                      {item.views ? (
                        <div className="inline-flex items-center gap-1 font-semibold">
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>{item.views.toLocaleString('id-ID')}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>

                    <td className="p-3.5 text-center">
                      {item.tautan ? (
                        <a
                          href={item.tautan}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                          title="Buka Publikasi Medsos"
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
                          title="Edit Publikasi"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus publikasi untuk "${item.judul}"?`)) {
                              onDeleteItem(item.id);
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Publikasi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    <Share2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="font-medium text-slate-600">Belum ada publikasi pada platform ini.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Klik "Catat Publikasi Baru" untuk mencatat konten media sosial yang tayang.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Add / Edit Distribusi */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#001838]">
                    {editingItem ? 'Edit Data Distribusi Medsos' : 'Catat Publikasi Baru'}
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
                    Platform Media Sosial
                  </label>
                  <select
                    value={formData.platform}
                    onChange={e => setFormData({ ...formData, platform: e.target.value as PlatformSosmed })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="X">X (Twitter)</option>
                  </select>
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
                  Judul Konten yang Dipublikasikan
                </label>
                <input
                  type="text"
                  placeholder="Judul tayangan di media sosial..."
                  value={formData.judul}
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Format / Kemasan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Reels / Shorts / Video Panjang"
                    value={formData.format}
                    onChange={e => setFormData({ ...formData, format: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Rencana Tayang
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
                    Tanggal Aktual Tayang
                  </label>
                  <input
                    type="date"
                    value={formData.tglAktual}
                    onChange={e => setFormData({ ...formData, tglAktual: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Publikasi
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as StatusDistribusi })}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Dipublikasikan">Dipublikasikan</option>
                    <option value="Tertunda">Tertunda</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Estimasi Views / Tayangan
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.views || 0}
                    onChange={e => setFormData({ ...formData, views: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tautan / Link Publikasi Medsos (YouTube, Reels, TikTok, X, dll)
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
                  Catatan / Hashtag & Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  placeholder="Catatan performa, sound trending, narasi caption..."
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
                  {editingItem ? 'Simpan Perubahan' : 'Simpan Publikasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
