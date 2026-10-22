import React, { useState } from 'react';
import { UserProfile } from '../types.ts';

interface LoginScreenProps {
  onLoginSuccess: (profile: Partial<UserProfile>) => void;
  onContinueAsGuest: () => void;
  onOpenNikModal: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  onOpenNikModal,
}) => {
  const [identifier, setIdentifier] = useState('812-3456-7890');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: identifier.includes('@') ? identifier.split('@')[0] : 'Warga Banyumas',
        phone: identifier.includes('@') ? '0812-3456-7890' : identifier,
        email: identifier.includes('@') ? identifier : 'warga.banyumas@gmail.com',
        isLoggedIn: true,
      });
    }, 600);
  };

  const handleSocialLogin = (provider: 'Google' | 'WhatsApp') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        name: provider === 'Google' ? 'Doni Fatkhul Amin' : 'Warga Banyumas (+62 812)',
        phone: '0812-3456-7890',
        email: 'donifatkhulamin@gmail.com',
        isLoggedIn: true,
      });
    }, 600);
  };

  return (
    <div className="w-full max-w-screen-sm mx-auto min-h-screen flex flex-col bg-surface-container-lowest border-x border-outline-variant/30 shadow-2xl">
      {/* Top Minimal Utility Bar with Dishub Emblem & Back Button */}
      <header className="w-full px-4 py-2.5 flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest sticky top-0 z-30">
        <div className="flex items-center space-x-2">
          <button
            onClick={onContinueAsGuest}
            className="w-7 h-7 rounded-full hover:bg-surface-container flex items-center justify-center text-primary cursor-pointer mr-1"
            title="Kembali ke Dashboard / Jelajah Tamu"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-semibold text-on-surface tracking-tight">
            Kemenhub & Dishub Kab. Banyumas
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onContinueAsGuest}
            className="text-[11px] font-bold text-primary hover:underline cursor-pointer"
          >
            Lewati (Tamu)
          </button>
          <div className="flex items-center space-x-1 text-on-surface-variant text-[11px] font-bold bg-surface-container-low px-2 py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
            <span>v2.4</span>
          </div>
        </div>
      </header>

      {/* Hero Visual Section with Illustration */}
      <section className="relative px-4 pt-3 pb-2">
        <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-lg border border-outline-variant/30 bg-surface-container">
          <img
            alt="Trans Banyumas Bus di Purwokerto dengan Gunung Slamet"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
            src="/assets/aistudio/Image_8_e6de6b25.jpeg"
            onError={(e) => {
              // fallback to external hosted url from original html
              (e.target as HTMLImageElement).src =
                'https://lh3.googleusercontent.com/aida-public/AB6AXuA03OF6AO7Wtqs_u51y1UjQA4o99pI_Xpwrn50HNfwKGjVjKR137huaLc4zMLu5UYiXyd2R5lABmxPbSEuN0SzJ9KAoD8iZDknu868skupIrZg2CUi7PFoRjDzIc3w8bJGioNKUsbVaGrFmTYO7U7yN3_TQ313aGkM9euO2vnIvrMifvBVP5sVMXWmjwYZ1pU13kOgSjrRxoVlMBv9qTPybkjroqL2KeKbEJravXj9W0ZusK9-EI9xc';
            }}
          />
          {/* Top Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent pointer-events-none" />
          {/* Floating Official Badge Top-Left */}
          <div className="absolute top-3 left-3 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md flex items-center space-x-1.5 border border-white/60">
            <span className="material-symbols-outlined text-primary text-[18px]">directions_bus</span>
            <span className="text-[11px] font-bold text-primary tracking-normal">
              Trans Banyumas MaaS - Resmi Dishub Banyumas
            </span>
          </div>
          {/* Live Status Floating Chip Bottom-Right */}
          <div className="absolute bottom-3 right-3 bg-secondary text-on-secondary px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping" />
            <span>Koridor 1, 2, 3 Aktif</span>
          </div>
        </div>
      </section>

      {/* Login & Welcome Card Canvas */}
      <main className="flex-1 px-4 sm:px-6 pt-3 pb-8">
        <div className="mb-5">
          <div className="inline-flex items-center space-x-1.5 text-primary mb-1">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Purwokerto • Banyumas
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl text-on-surface font-extrabold tracking-tight font-headline">
            {mode === 'login' ? 'Selamat Datang di Trans Banyumas' : 'Daftar Akun Trans Banyumas'}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
            Solusi mobilitas terintegrasi bus & angkutan pengumpan se-Kabupaten Banyumas.
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-on-surface mb-1.5" htmlFor="credential-input">
              Nomor HP atau Email Terdaftar
            </label>
            <div className="relative flex items-center rounded-lg border border-outline-variant bg-surface-container-lowest focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
              <div className="flex items-center pl-3.5 pr-2 border-r border-outline-variant/50 text-on-surface-variant py-2.5">
                <span className="material-symbols-outlined text-primary mr-1 text-[20px]">call</span>
                <span className="text-xs font-bold text-on-surface">+62</span>
              </div>
              <input
                id="credential-input"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="812-3456-7890 atau email@banyumas.go.id"
                required
                className="w-full border-none bg-transparent px-3 py-3 text-sm text-on-surface placeholder:text-outline/70 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-bold text-on-surface" htmlFor="password-input">
                Kata Sandi / PIN Akun
              </label>
              <span className="text-[11px] text-outline font-semibold">PIN 6-Digit / Sandi</span>
            </div>
            <div className="relative flex items-center rounded-lg border border-outline-variant bg-surface-container-lowest focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
              <div className="pl-3.5 text-on-surface-variant flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
              </div>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi akun MaaS"
                required
                className="w-full border-none bg-transparent px-3 py-3 text-sm text-on-surface placeholder:text-outline/70 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                aria-label="Lihat kata sandi"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary"
              />
              <span className="text-xs text-on-surface font-medium">Ingat Saya</span>
            </label>
            <button
              type="button"
              onClick={() => alert('Fitur pemulihan kata sandi telah dikirim ke nomor HP terdaftar via SMS/WhatsApp OTP.')}
              className="text-xs text-primary font-bold hover:underline transition-colors cursor-pointer"
            >
              Lupa Kata Sandi?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-primary-container hover:bg-primary active:scale-[0.98] text-on-primary font-bold text-sm rounded-lg flex items-center justify-center space-x-2 shadow-md transition-all duration-150 mt-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <>
                <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar & Masuk'}</span>
                <span className="material-symbols-outlined text-[20px]">login</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant/40" />
          </div>
          <div className="relative flex justify-center text-[11px] font-bold">
            <span className="bg-surface-container-lowest px-3 text-outline uppercase tracking-wider">
              Atau masuk lebih cepat
            </span>
          </div>
        </div>

        {/* Alternative Fast Login Grid */}
        <div className="space-y-2.5">
          {/* NIK / KTP Button */}
          <button
            onClick={onOpenNikModal}
            type="button"
            className="w-full p-3 rounded-lg border-2 border-secondary/40 bg-surface-container-low hover:bg-secondary-fixed/20 active:scale-[0.99] transition-all flex items-center justify-between text-left group shadow-xs cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">badge</span>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm text-on-surface font-bold">Masuk Cepat dengan NIK / KTP</span>
                  <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Subsidi Banyumas
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Khusus tarif pelajar, mahasiswa, lansia & disabilitas
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Google */}
            <button
              onClick={() => handleSocialLogin('Google')}
              type="button"
              className="h-11 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low active:scale-95 transition-all flex items-center justify-center space-x-2 text-on-surface text-xs font-bold cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleSocialLogin('WhatsApp')}
              type="button"
              className="h-11 px-3 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low active:scale-95 transition-all flex items-center justify-center space-x-2 text-on-surface text-xs font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#25D366] text-[20px]">chat</span>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Mode Tamu (Tanpa Akun) */}
        <div className="mt-4">
          <button
            onClick={onContinueAsGuest}
            type="button"
            className="w-full py-2.5 px-3 rounded-lg border border-dashed border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary bg-surface-container-low/50 flex items-center justify-center space-x-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">explore</span>
            <span className="text-xs font-bold">Masuk Sebagai Tamu (Cek Rute & Jadwal)</span>
          </button>
        </div>

        {/* Sign Up Prompt Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-on-surface-variant">
            {mode === 'login' ? 'Belum punya akun Trans Banyumas?' : 'Sudah punya akun Trans Banyumas?'}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              type="button"
              className="text-primary font-bold hover:underline inline-flex items-center ml-1 cursor-pointer"
            >
              {mode === 'login' ? 'Daftar Sekarang' : 'Masuk Sekarang'}
              <span className="material-symbols-outlined text-[16px] ml-0.5">arrow_forward</span>
            </button>
          </p>
        </div>

        {/* Official Security & Legal Notice */}
        <div className="mt-6 pt-4 border-t border-outline-variant/30 text-center">
          <div className="flex items-center justify-center space-x-1.5 text-outline mb-1.5">
            <span className="material-symbols-outlined text-[15px]">lock_outline</span>
            <span className="text-[11px] font-semibold">Dilindungi Enkripsi Standar Kemenhub RI</span>
          </div>
          <p className="text-[11px] text-outline leading-tight">
            Dengan masuk, Anda menyetujui Ketentuan Layanan, Penggunaan Tiket Elektronik, serta Kebijakan Privasi Dinas Perhubungan Kabupaten Banyumas.
          </p>
        </div>
      </main>

      {/* Municipal Transit Footer */}
      <footer className="w-full py-3 px-4 bg-surface-container text-center border-t border-outline-variant/30">
        <div className="flex items-center justify-center space-x-4 text-outline text-[11px] font-semibold">
          <span>Banyumas Smart City</span>
          <span>•</span>
          <span>Call Center 112 / WhatsApp Dishub</span>
          <span>•</span>
          <span>Tarif Integrasi 2025</span>
        </div>
      </footer>
    </div>
  );
};
