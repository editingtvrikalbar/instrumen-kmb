import React, { useState } from 'react';
import { LogIn, ShieldCheck, UserCheck, Tv, Lock, CheckCircle2 } from 'lucide-react';
import { UserRole, UserSession } from '../types';
import { TvriLogo } from './TvriLogo';

interface LoginViewProps {
  daftarPetugas: string[];
  onLogin: (session: UserSession) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ daftarPetugas, onLogin }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [selectedPetugas, setSelectedPetugas] = useState<string>(daftarPetugas[0] || 'Darius Tarigan');
  const [password, setPassword] = useState('tvri123');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      isLoggedIn: true,
      role: role,
      petugasName: role === 'admin' ? 'Administrator' : selectedPetugas
    });
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-[#00142b] via-[#00224f] to-slate-950 overflow-hidden">
      {/* Background Studio Graphic with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/tvri_broadcast_studio_1791969169904.jpg"
          alt="Studio TVRI Broadcast Control Room"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity filter blur-[1px]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001024] via-[#001838]/85 to-[#00142b]/95" />
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-2xl border-t-4 border-red-600 overflow-hidden">
        {/* Top Header */}
        <div className="p-8 text-center bg-gradient-to-b from-blue-50/60 to-white border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#001838] to-[#002b66] text-white rounded-2xl shadow-lg mb-4 border border-blue-400/30">
            <Tv className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-extrabold text-[#001838] tracking-tight">
            TVRI KALIMANTAN BARAT
          </h2>
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mt-0.5">
            Instrumen Konten Media Baru
          </p>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Sistem Pemantauan Perencanaan, Produksi, dan Distribusi Multiplatform
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLoginSubmit} className="p-8 space-y-4 text-xs">
          {/* Role Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Pilih Peran Akses Sistem
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2.5 px-3 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  role === 'admin'
                    ? 'border-red-600 bg-red-50/70 text-red-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck
                  className={`w-4 h-4 ${
                    role === 'admin' ? 'text-red-600' : 'text-slate-400'
                  }`}
                />
                <div>
                  <span className="block text-xs">Administrator</span>
                  <span className="text-[9px] text-slate-500 font-normal">Akses Penuh</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('petugas')}
                className={`py-2.5 px-3 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  role === 'petugas'
                    ? 'border-red-600 bg-red-50/70 text-red-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <UserCheck
                  className={`w-4 h-4 ${
                    role === 'petugas' ? 'text-red-600' : 'text-slate-400'
                  }`}
                />
                <div>
                  <span className="block text-xs">Petugas / Kru</span>
                  <span className="text-[9px] text-slate-500 font-normal">Kru Media Baru</span>
                </div>
              </button>
            </div>
          </div>

          {/* If Petugas: Select Petugas Name */}
          {role === 'petugas' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Nama Petugas / Kru Pelaksana
              </label>
              <select
                value={selectedPetugas}
                onChange={e => setSelectedPetugas(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-xs text-slate-800 font-medium cursor-pointer"
              >
                {daftarPetugas.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Password Simulation */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Kata Sandi Akses (Simulasi)
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none text-xs text-slate-700 font-mono"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Gunakan sandi bawaan (<code className="text-red-600 font-mono">tvri123</code>) untuk demonstrasi operasional.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Aplikasi</span>
            </button>
          </div>
        </form>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
          <p>© 2026 LPP TVRI Stasiun Kalimantan Barat</p>
          <p className="text-[9px] text-slate-400/80 mt-0.5">
            Seksi Media Baru & Konten Digital · Pontianak
          </p>
        </div>
      </div>
    </div>
  );
};
