import { ProduksiItem, DistribusiItem, GlobalSettings, UserSession } from '../types';
import { DAFTAR_PETUGAS_DEFAULT, GLOBAL_SETTINGS_DEFAULT, PRODUKSI_ITEMS_DEFAULT, DISTRIBUSI_ITEMS_DEFAULT } from '../data/initialData';

const KEYS = {
  PRODUKSI: 'tvri_kalbar_produksi_v1',
  DISTRIBUSI: 'tvri_kalbar_distribusi_v1',
  SETTINGS: 'tvri_kalbar_settings_v1',
  PETUGAS: 'tvri_kalbar_petugas_v1',
  SESSION: 'tvri_kalbar_session_v1',
};

export const getStoredProduksi = (): ProduksiItem[] => {
  try {
    const raw = localStorage.getItem(KEYS.PRODUKSI);
    if (!raw) {
      localStorage.setItem(KEYS.PRODUKSI, JSON.stringify(PRODUKSI_ITEMS_DEFAULT));
      return PRODUKSI_ITEMS_DEFAULT;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load produksi items from storage:', err);
    return PRODUKSI_ITEMS_DEFAULT;
  }
};

export const saveStoredProduksi = (items: ProduksiItem[]): void => {
  try {
    localStorage.setItem(KEYS.PRODUKSI, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save produksi items to storage:', err);
  }
};

export const getStoredDistribusi = (): DistribusiItem[] => {
  try {
    const raw = localStorage.getItem(KEYS.DISTRIBUSI);
    if (!raw) {
      localStorage.setItem(KEYS.DISTRIBUSI, JSON.stringify(DISTRIBUSI_ITEMS_DEFAULT));
      return DISTRIBUSI_ITEMS_DEFAULT;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load distribusi items from storage:', err);
    return DISTRIBUSI_ITEMS_DEFAULT;
  }
};

export const saveStoredDistribusi = (items: DistribusiItem[]): void => {
  try {
    localStorage.setItem(KEYS.DISTRIBUSI, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save distribusi items to storage:', err);
  }
};

export const getStoredSettings = (): GlobalSettings => {
  try {
    const raw = localStorage.getItem(KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(GLOBAL_SETTINGS_DEFAULT));
      return GLOBAL_SETTINGS_DEFAULT;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load settings from storage:', err);
    return GLOBAL_SETTINGS_DEFAULT;
  }
};

export const saveStoredSettings = (settings: GlobalSettings): void => {
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings to storage:', err);
  }
};

export const getStoredPetugas = (): string[] => {
  try {
    const raw = localStorage.getItem(KEYS.PETUGAS);
    if (!raw) {
      localStorage.setItem(KEYS.PETUGAS, JSON.stringify(DAFTAR_PETUGAS_DEFAULT));
      return DAFTAR_PETUGAS_DEFAULT;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load petugas from storage:', err);
    return DAFTAR_PETUGAS_DEFAULT;
  }
};

export const saveStoredPetugas = (petugas: string[]): void => {
  try {
    localStorage.setItem(KEYS.PETUGAS, JSON.stringify(petugas));
  } catch (err) {
    console.error('Failed to save petugas to storage:', err);
  }
};

export const getStoredSession = (): UserSession => {
  try {
    const raw = localStorage.getItem(KEYS.SESSION);
    if (!raw) {
      return {
        isLoggedIn: false,
        role: 'admin',
        petugasName: 'Administrator'
      };
    }
    return JSON.parse(raw);
  } catch (err) {
    return {
      isLoggedIn: false,
      role: 'admin',
      petugasName: 'Administrator'
    };
  }
};

export const saveStoredSession = (session: UserSession): void => {
  try {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session:', err);
  }
};

export const clearStoredSession = (): void => {
  try {
    localStorage.removeItem(KEYS.SESSION);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
};

export const resetAllDataToDefault = (): void => {
  localStorage.setItem(KEYS.PRODUKSI, JSON.stringify(PRODUKSI_ITEMS_DEFAULT));
  localStorage.setItem(KEYS.DISTRIBUSI, JSON.stringify(DISTRIBUSI_ITEMS_DEFAULT));
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(GLOBAL_SETTINGS_DEFAULT));
  localStorage.setItem(KEYS.PETUGAS, JSON.stringify(DAFTAR_PETUGAS_DEFAULT));
};

export const generateNextJobNo = (existingItems: ProduksiItem[]): string => {
  const year = new Date().getFullYear();
  const nextNum = existingItems.length + 1;
  return `JOB-${year}-${String(nextNum).padStart(3, '0')}`;
};

export const formatIndonesianDate = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch {
    return dateString;
  }
};

export const formatFullIndonesianDate = (date: Date = new Date()): string => {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

export const exportToCSV = (filename: string, rows: (string | number)[][], headers: string[]): void => {
  const content = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row =>
      row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
    )
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
