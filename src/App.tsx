import React, { useState } from 'react';
import { TabType, UserProfile, UserTicket, TripRecommendation } from './types.ts';
import { INITIAL_TICKET } from './data/mockData.ts';
import { TopAppBar } from './components/TopAppBar.tsx';
import { BottomNavBar } from './components/BottomNavBar.tsx';
import { NotificationModal } from './components/NotificationModal.tsx';
import { TopUpModal } from './components/TopUpModal.tsx';
import { NikSubsidyModal } from './components/NikSubsidyModal.tsx';
import { TimePickerModal } from './components/TimePickerModal.tsx';
import { DownloadTicketModal } from './components/DownloadTicketModal.tsx';

import { DashboardScreen } from './screens/DashboardScreen.tsx';
import { RencanaScreen } from './screens/RencanaScreen.tsx';
import { TrackingScreen } from './screens/TrackingScreen.tsx';
import { TiketScreen } from './screens/TiketScreen.tsx';
import { AntarModaScreen } from './screens/AntarModaScreen.tsx';
import { HistoryScreen } from './screens/HistoryScreen.tsx';
import { LoginScreen } from './screens/LoginScreen.tsx';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [showLoginScreen, setShowLoginScreen] = useState<boolean>(false);
  const [departureTime, setDepartureTime] = useState<string>('Berangkat Sekarang (08:30 WIB)');
  const [plannedOrigin, setPlannedOrigin] = useState<string>('Jl. Raden Patah, Ledug');
  const [plannedDestination, setPlannedDestination] = useState<string>('Stasiun Purwokerto');
  const [feederTargetStop, setFeederTargetStop] = useState<string>('Halte Alun-Alun Purwokerto');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [nikModalOpen, setNikModalOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);

  // User & Ticket State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Doni Fatkhul Amin',
    phone: '0812-3456-7890',
    email: 'donifatkhulamin@gmail.com',
    isSubsidyVerified: true,
    subsidyType: 'Mahasiswa',
    walletBalance: 45000,
    isLoggedIn: true,
  });

  const [activeTicket, setActiveTicket] = useState<UserTicket>(INITIAL_TICKET);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Booking a multimodal route
  const handleSelectRoute = (rec: TripRecommendation) => {
    const newId = `#TBM-2025-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const expires = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const expStr = `Hari ini, ${String(expires.getHours()).padStart(2, '0')}:${String(
      expires.getMinutes()
    ).padStart(2, '0')} WIB`;

    const newTicket: UserTicket = {
      ticketId: newId,
      issuedAt: `Hari ini, ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')} WIB`,
      expiresAt: expStr,
      status: 'active',
      origin: plannedOrigin,
      destination: plannedDestination,
      legs: rec.legs.map((l, idx) => ({
        sequence: idx + 1,
        title: l.title,
        description: l.subtitle,
        cost: l.cost,
        type: l.type,
      })),
      totalFare: rec.totalCost,
      discount: 2500,
      paymentMethod: 'qris',
      passengerType: userProfile.subsidyType || 'Umum',
    };

    setActiveTicket(newTicket);
    showToast(`Tiket Terpadu ${newId} berhasil diterbitkan!`);
    setActiveTab('tiket');
  };

  // Top up balance handler
  const handleTopUpSuccess = (amount: number) => {
    setUserProfile((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));
    showToast(`Top-up Rp ${amount.toLocaleString('id-ID')} berhasil masuk!`);
  };

  // NIK subsidy verification
  const handleVerifySubsidy = (name: string, category: 'Pelajar' | 'Mahasiswa' | 'Lansia' | 'Disabilitas') => {
    setUserProfile((prev) => ({
      ...prev,
      name,
      isSubsidyVerified: true,
      subsidyType: category,
      isLoggedIn: true,
    }));
    setShowLoginScreen(false);
    showToast(`Subsidi ${category} Banyumas Berhasil Diaktifkan!`);
  };

  // Login handler
  const handleLoginSuccess = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({
      ...prev,
      ...profile,
      isLoggedIn: true,
    }));
    setShowLoginScreen(false);
    showToast(`Selamat datang kembali, ${profile.name || 'Warga Banyumas'}!`);
  };

  // Jump from search in Dashboard to Rencana
  const handleSearchFromDashboard = (orig: string, dest: string) => {
    setPlannedOrigin(orig);
    setPlannedDestination(dest);
    setActiveTab('rencana');
  };

  // Jump from tracking stop feeder to Antar Moda
  const handleBookFeederAtStop = (stopName: string) => {
    setFeederTargetStop(stopName);
    setActiveTab('antarmoda');
  };

  // Repeat trip from History
  const handleRepeatTrip = (orig: string, dest: string) => {
    setPlannedOrigin(orig);
    setPlannedDestination(dest);
    setActiveTab('rencana');
    showToast(`Rute "${orig} ➔ ${dest}" disiapkan di Rencana!`);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col items-center">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-3 z-50 max-w-sm mx-auto px-4 py-2.5 rounded-xl bg-on-surface text-surface-bright shadow-2xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-secondary text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Mode: Login View vs Main Application */}
      {showLoginScreen ? (
        <LoginScreen
          onLoginSuccess={handleLoginSuccess}
          onContinueAsGuest={() => setShowLoginScreen(false)}
          onOpenNikModal={() => setNikModalOpen(true)}
        />
      ) : (
        <div className="relative min-h-screen w-full max-w-screen-sm mx-auto bg-surface-container-low shadow-2xl flex flex-col overflow-x-hidden border-x border-outline-variant/30">
          {/* Top Bar for all app screens */}
          <TopAppBar
            activeTab={activeTab}
            userName={userProfile.name}
            onBack={() => setActiveTab('dashboard')}
            onRefresh={() => showToast('Memperbarui data GPS & trafik...')}
            onOpenNotifications={() => setNotificationOpen(true)}
            onOpenAuth={() => setShowLoginScreen(true)}
          />

          {/* Screen Content Tabs */}
          <div className="flex-1 flex flex-col">
            {activeTab === 'dashboard' && (
              <DashboardScreen
                onNavigateTab={(tab) => setActiveTab(tab)}
                userProfile={userProfile}
                onOpenTopUp={() => setTopUpOpen(true)}
                onSearchRoute={handleSearchFromDashboard}
              />
            )}

            {activeTab === 'rencana' && (
              <RencanaScreen
                initialOrigin={plannedOrigin}
                initialDestination={plannedDestination}
                departureTime={departureTime}
                onSelectRoute={handleSelectRoute}
                onOpenTimePicker={() => setTimePickerOpen(true)}
              />
            )}

            {activeTab === 'tracking' && (
              <TrackingScreen
                onNavigateTab={(tab) => setActiveTab(tab)}
                onBookFeederAtStop={handleBookFeederAtStop}
              />
            )}

            {activeTab === 'tiket' && (
              <TiketScreen
                ticket={activeTicket}
                walletBalance={userProfile.walletBalance}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onOpenDownloadModal={() => setDownloadModalOpen(true)}
              />
            )}

            {activeTab === 'antarmoda' && (
              <AntarModaScreen
                onNavigateTab={(tab) => setActiveTab(tab)}
                preselectedStop={feederTargetStop}
              />
            )}

            {activeTab === 'history' && (
              <HistoryScreen
                onNavigateTab={(tab) => setActiveTab(tab)}
                onRepeatTrip={handleRepeatTrip}
              />
            )}
          </div>

          {/* Bottom Navigation */}
          <BottomNavBar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            hasActiveTicket={activeTicket.status === 'active'}
          />
        </div>
      )}

      {/* Interactive Modals */}
      <NotificationModal
        isOpen={notificationOpen}
        onClose={() => setNotificationOpen(false)}
      />

      <TopUpModal
        isOpen={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        currentBalance={userProfile.walletBalance}
        onTopUpSuccess={handleTopUpSuccess}
      />

      <NikSubsidyModal
        isOpen={nikModalOpen}
        onClose={() => setNikModalOpen(false)}
        onVerifySuccess={handleVerifySubsidy}
      />

      <TimePickerModal
        isOpen={timePickerOpen}
        onClose={() => setTimePickerOpen(false)}
        currentTime={departureTime}
        onTimeSelected={(newTime) => setDepartureTime(newTime)}
      />

      <DownloadTicketModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        ticket={activeTicket}
      />
    </div>
  );
}
