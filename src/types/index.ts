export type UserRole = 'admin' | 'petugas';

export type JenisKonten = 
  | 'Berita'
  | 'Feature'
  | 'Program'
  | 'Liputan'
  | 'Video Pendek'
  | 'Talkshow'
  | 'Live Streaming'
  | 'Lainnya';

export type StatusProduksi = 'Direncanakan' | 'Dalam Proses' | 'Selesai' | 'Tertunda';

export interface ProduksiItem {
  id: string;
  noPekerjaan: string;
  petugas: string;
  judul: string;
  jenis: JenisKonten;
  tglRencana: string; // YYYY-MM-DD
  targetJumlah: number;
  tglReal: string; // YYYY-MM-DD
  jumlahAktual: number;
  status: StatusProduksi;
  tautan: string;
  catatan?: string;
  createdAt: string;
}

export type PlatformSosmed = 'YouTube' | 'Instagram' | 'Facebook' | 'TikTok' | 'X';

export type StatusDistribusi = 'Terjadwal' | 'Dipublikasikan' | 'Tertunda';

export interface DistribusiItem {
  id: string;
  platform: PlatformSosmed;
  petugas: string;
  judul: string;
  format: string; // e.g. Reels, Shorts, Video Panjang, Feed Carousel, Tweet Thread
  tglRencana: string; // YYYY-MM-DD
  tglAktual: string; // YYYY-MM-DD
  status: StatusDistribusi;
  tautan: string;
  views?: number;
  likes?: number;
  shares?: number;
  catatan?: string;
  createdAt: string;
}

export interface GlobalSettings {
  targetProduksi: number;
  targetPublikasi: number;
  namaKepalaSeksi: string;
  nipKepalaSeksi: string;
  periodeAktif: string;
  namaStasiun: string;
  alamatStasiun: string;
}

export interface UserSession {
  isLoggedIn: boolean;
  role: UserRole;
  petugasName: string;
}

export type TabType = 'dashboard' | 'produksi' | 'distribusi' | 'kalender' | 'laporan' | 'pengaturan';
