/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TabType, 
  ProduksiItem, 
  DistribusiItem, 
  GlobalSettings, 
  UserSession 
} from './types';
import { 
  getStoredProduksi, 
  saveStoredProduksi, 
  getStoredDistribusi, 
  saveStoredDistribusi, 
  getStoredSettings, 
  saveStoredSettings, 
  getStoredPetugas, 
  saveStoredPetugas, 
  getStoredSession, 
  saveStoredSession, 
  clearStoredSession,
  resetAllDataToDefault
} from './utils/storage';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ProduksiView } from './components/ProduksiView';
import { DistribusiView } from './components/DistribusiView';
import { KalenderView } from './components/KalenderView';
import { LaporanView } from './components/LaporanView';
import { PengaturanView } from './components/PengaturanView';
import { LoginView } from './components/LoginView';

export default function App() {
  const [session, setSession] = useState<UserSession>(() => getStoredSession());
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data
  const [produksiList, setProduksiList] = useState<ProduksiItem[]>(() => getStoredProduksi());
  const [distribusiList, setDistribusiList] = useState<DistribusiItem[]>(() => getStoredDistribusi());
  const [settings, setSettings] = useState<GlobalSettings>(() => getStoredSettings());
  const [daftarPetugas, setDaftarPetugas] = useState<string[]>(() => getStoredPetugas());

  // Modal triggers
  const [isProduksiModalOpen, setIsProduksiModalOpen] = useState(false);
  const [isDistribusiModalOpen, setIsDistribusiModalOpen] = useState(false);

  // Keep localStorage synchronized
  useEffect(() => {
    saveStoredProduksi(produksiList);
  }, [produksiList]);

  useEffect(() => {
    saveStoredDistribusi(distribusiList);
  }, [distribusiList]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStoredPetugas(daftarPetugas);
  }, [daftarPetugas]);

  // Auth Handlers
  const handleLogin = (newSession: UserSession) => {
    setSession(newSession);
    saveStoredSession(newSession);
  };

  const handleLogout = () => {
    clearStoredSession();
    setSession({
      isLoggedIn: false,
      role: 'admin',
      petugasName: 'Administrator'
    });
  };

  // Produksi CRUD
  const handleSaveProduksi = (item: ProduksiItem) => {
    setProduksiList(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
  };

  const handleDeleteProduksi = (id: string) => {
    setProduksiList(prev => prev.filter(i => i.id !== id));
  };

  // Distribusi CRUD
  const handleSaveDistribusi = (item: DistribusiItem) => {
    setDistribusiList(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = item;
        return copy;
      }
      return [item, ...prev];
    });
  };

  const handleDeleteDistribusi = (id: string) => {
    setDistribusiList(prev => prev.filter(i => i.id !== id));
  };

  // Settings & Team Handlers
  const handleSaveSettings = (newSettings: GlobalSettings) => {
    setSettings(newSettings);
  };

  const handleSavePetugas = (newPetugas: string[]) => {
    setDaftarPetugas(newPetugas);
  };

  const handleRestoreAllData = (data: {
    produksi: ProduksiItem[];
    distribusi: DistribusiItem[];
    settings: GlobalSettings;
    petugas: string[];
  }) => {
    setProduksiList(data.produksi);
    setDistribusiList(data.distribusi);
    setSettings(data.settings);
    setDaftarPetugas(data.petugas);
  };

  const handleResetDefaults = () => {
    resetAllDataToDefault();
    setProduksiList(getStoredProduksi());
    setDistribusiList(getStoredDistribusi());
    setSettings(getStoredSettings());
    setDaftarPetugas(getStoredPetugas());
  };

  // If not logged in, render the login page
  if (!session.isLoggedIn) {
    return (
      <LoginView
        daftarPetugas={daftarPetugas}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          setSidebarOpen(false);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        session={session}
        onLogout={handleLogout}
        totalProduksiCount={produksiList.length}
        totalDistribusiCount={distribusiList.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          session={session}
          onOpenProduksiModal={() => {
            setCurrentTab('produksi');
            setIsProduksiModalOpen(true);
          }}
          onOpenDistribusiModal={() => {
            setCurrentTab('distribusi');
            setIsDistribusiModalOpen(true);
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              produksiList={produksiList}
              distribusiList={distribusiList}
              daftarPetugas={daftarPetugas}
              settings={settings}
              onNavigateToTab={tab => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'produksi' && (
            <ProduksiView
              items={produksiList}
              daftarPetugas={daftarPetugas}
              currentUser={session.petugasName}
              userRole={session.role}
              onSaveItem={handleSaveProduksi}
              onDeleteItem={handleDeleteProduksi}
              isOpenModal={isProduksiModalOpen}
              onCloseModal={() => setIsProduksiModalOpen(false)}
              onOpenModal={() => setIsProduksiModalOpen(true)}
            />
          )}

          {currentTab === 'distribusi' && (
            <DistribusiView
              items={distribusiList}
              daftarPetugas={daftarPetugas}
              currentUser={session.petugasName}
              userRole={session.role}
              onSaveItem={handleSaveDistribusi}
              onDeleteItem={handleDeleteDistribusi}
              isOpenModal={isDistribusiModalOpen}
              onCloseModal={() => setIsDistribusiModalOpen(false)}
              onOpenModal={() => setIsDistribusiModalOpen(true)}
            />
          )}

          {currentTab === 'kalender' && (
            <KalenderView
              produksiList={produksiList}
              distribusiList={distribusiList}
              daftarPetugas={daftarPetugas}
            />
          )}

          {currentTab === 'laporan' && (
            <LaporanView
              produksiList={produksiList}
              distribusiList={distribusiList}
              daftarPetugas={daftarPetugas}
              settings={settings}
              session={session}
            />
          )}

          {currentTab === 'pengaturan' && (
            <PengaturanView
              settings={settings}
              daftarPetugas={daftarPetugas}
              produksiList={produksiList}
              distribusiList={distribusiList}
              onSaveSettings={handleSaveSettings}
              onSavePetugas={handleSavePetugas}
              onRestoreAllData={handleRestoreAllData}
              onResetDefaults={handleResetDefaults}
            />
          )}
        </main>
      </div>
    </div>
  );
}
