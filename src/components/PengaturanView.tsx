import React, { useState } from 'react';
import { 
  Settings, 
  Users, 
  Target, 
  Database, 
  Save, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RefreshCw,
  CheckCircle2,
  Building
} from 'lucide-react';
import { GlobalSettings, ProduksiItem, DistribusiItem } from '../types';

interface PengaturanViewProps {
  settings: GlobalSettings;
  daftarPetugas: string[];
  produksiList: ProduksiItem[];
  distribusiList: DistribusiItem[];
  onSaveSettings: (settings: GlobalSettings) => void;
  onSavePetugas: (petugas: string[]) => void;
  onRestoreAllData: (data: {
    produksi: ProduksiItem[];
    distribusi: DistribusiItem[];
    settings: GlobalSettings;
    petugas: string[];
  }) => void;
  onResetDefaults: () => void;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  settings,
  daftarPetugas,
  produksiList,
  distribusiList,
  onSaveSettings,
  onSavePetugas,
  onRestoreAllData,
  onResetDefaults
}) => {
  const [formData, setFormData] = useState<GlobalSettings>({ ...settings });
  const [petugasList, setPetugasList] = useState<string[]>([...daftarPetugas]);
  const [newPetugasName, setNewPetugasName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddPetugas = () => {
    const trimmed = newPetugasName.trim();
    if (!trimmed) return;
    if (petugasList.includes(trimmed)) {
      alert('Nama petugas sudah terdaftar.');
      return;
    }
    const updated = [...petugasList, trimmed];
    setPetugasList(updated);
    onSavePetugas(updated);
    setNewPetugasName('');
  };

  const handleRemovePetugas = (name: string) => {
    if (petugasList.length <= 1) {
      alert('Minimal harus ada satu petugas dalam daftar.');
      return;
    }
    if (confirm(`Hapus "${name}" dari daftar petugas?`)) {
      const updated = petugasList.filter(p => p !== name);
      setPetugasList(updated);
      onSavePetugas(updated);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      station: 'TVRI Stasiun Kalimantan Barat',
      settings: formData,
      petugas: petugasList,
      produksi: produksiList,
      distribusi: distribusiList
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_TVRI_Kalbar_MediaBaru_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.produksi && parsed.distribusi) {
          onRestoreAllData({
            produksi: parsed.produksi,
            distribusi: parsed.distribusi,
            settings: parsed.settings || settings,
            petugas: parsed.petugas || daftarPetugas
          });
          setFormData(parsed.settings || settings);
          setPetugasList(parsed.petugas || daftarPetugas);
          alert('Data cadangan berhasil dipulihkan!');
        } else {
          alert('Format file cadangan tidak valid.');
        }
      } catch (err) {
        alert('Gagal membaca file JSON cadangan.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#001838]">
            Pengaturan Target & Sistem Media Baru
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Konfigurasi target capaian kinerja, administrasi kru pelaksana, dan pengelolaan basis data
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Pengaturan Berhasil Disimpan</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form 1: Target & Pejabat Seksi */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Target className="w-5 h-5 text-red-600" />
            <h4 className="font-bold text-sm text-[#001838]">
              Target Kinerja & Pejabat Penandatangan
            </h4>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Total Produksi Konten
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.targetProduksi}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      targetProduksi: parseInt(e.target.value) || 1
                    })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Target agregat produksi per periode evaluasi
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Total Publikasi Medsos
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.targetPublikasi}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      targetPublikasi: parseInt(e.target.value) || 1
                    })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Target penayangan di 5 kanal medsos
                </p>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Periode Aktif Evaluasi
              </label>
              <input
                type="text"
                value={formData.periodeAktif}
                onChange={e =>
                  setFormData({ ...formData, periodeAktif: e.target.value })
                }
                required
                placeholder="Contoh: Tahun 2026 / Triwulan IV"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ketua Tim / KPP Media Baru
                </label>
                <input
                  type="text"
                  value={formData.namaKepalaSeksi}
                  onChange={e =>
                    setFormData({ ...formData, namaKepalaSeksi: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  NIP Pejabat
                </label>
                <input
                  type="text"
                  value={formData.nipKepalaSeksi}
                  onChange={e =>
                    setFormData({ ...formData, nipKepalaSeksi: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Alamat Kantor Stasiun
              </label>
              <input
                type="text"
                value={formData.alamatStasiun}
                onChange={e =>
                  setFormData({ ...formData, alamatStasiun: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-semibold shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Target</span>
              </button>
            </div>
          </form>
        </div>

        {/* Form 2: Manajemen Kru / Petugas */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-bold text-sm text-[#001838]">
              Daftar Petugas / Kru Media Baru
            </h4>
          </div>

          <div className="space-y-3 text-xs">
            {/* Input Add New Petugas */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Masukkan nama petugas baru..."
                value={newPetugasName}
                onChange={e => setNewPetugasName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPetugas();
                  }
                }}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddPetugas}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </button>
            </div>

            {/* List Petugas */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {petugasList.map((petugas, index) => (
                <div
                  key={petugas}
                  className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[10px] font-mono">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">{petugas}</p>
                      <span className="text-[10px] text-slate-400">
                        Kru Aktif Media Baru TVRI Kalbar
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemovePetugas(petugas)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Petugas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cadangan & Pemulihan Data */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <Database className="w-5 h-5 text-emerald-600" />
          <h4 className="font-bold text-sm text-[#001838]">
            Cadangan, Pemulihan & Reset Data Sistem
          </h4>
        </div>

        <p className="text-xs text-slate-500">
          Seluruh data operasional TVRI Kalbar tersimpan secara aman di peramban (Local Storage).
          Gunakan fitur ekspor di bawah untuk mencadangkan data ke file JSON atau memulihkan data antar komputer tim.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportBackup}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor File Cadangan (JSON)</span>
          </button>

          <label className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Pulihkan Data dari JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              if (
                confirm(
                  'PERINGATAN: Apakah Anda yakin ingin mengatur ulang data ke data demo bawaan TVRI Kalbar? Semua data tambahan Anda akan digantikan.'
                )
              ) {
                onResetDefaults();
                alert('Data berhasil diatur ulang ke template bawaan TVRI Kalbar.');
              }
            }}
            className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Data Demo Default</span>
          </button>
        </div>
      </div>
    </div>
  );
};
