import React, { useState } from 'react';

interface NikSubsidyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: (name: string, category: 'Pelajar' | 'Mahasiswa' | 'Lansia' | 'Disabilitas') => void;
}

export const NikSubsidyModal: React.FC<NikSubsidyModalProps> = ({
  isOpen,
  onClose,
  onVerifySuccess,
}) => {
  const [nik, setNik] = useState('');
  const [fullName, setFullName] = useState('');
  const [category, setCategory] = useState<'Pelajar' | 'Mahasiswa' | 'Lansia' | 'Disabilitas'>('Mahasiswa');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (nik.length < 12) {
      setError('Masukkan minimal 16 digit NIK yang valid (e.g. 3302xxxxxxxxxxxx)');
      return;
    }
    setError('');
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      onVerifySuccess(fullName.trim() || 'Warga Banyumas', category);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl border border-outline-variant/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">badge</span>
            <h3 className="font-bold text-on-surface font-headline text-base">Verifikasi Subsidi NIK</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleVerify} className="p-4 space-y-3.5">
          <div className="bg-secondary/10 p-3 rounded-xl border border-secondary/30 text-xs text-on-surface">
            <p className="font-semibold text-secondary flex items-center gap-1 mb-0.5">
              <span className="material-symbols-outlined text-sm">verified</span>
              Program Kemenhub & Dishub Banyumas
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              Dapatkan tarif bersubsidi hingga 100% (Gratis) untuk seluruh koridor Trans Banyumas.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Nomor Induk Kependudukan (NIK 16-Digit)
            </label>
            <input
              type="text"
              value={nik}
              onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 16))}
              placeholder="3302xxxxxxxxxxxx"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">
              Nama Lengkap Sesuai KTP / Kartu Pelajar
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Doni Fatkhul Amin"
              required
              className="w-full px-3 py-2.5 rounded-lg border border-outline-variant text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Kategori Pemohon</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Pelajar', 'Mahasiswa', 'Lansia', 'Disabilitas'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer text-center ${
                    category === cat
                      ? 'border-secondary bg-secondary-container text-on-secondary-container font-bold'
                      : 'border-outline-variant/60 hover:bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-error font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full py-2.5 bg-secondary hover:bg-opacity-90 text-on-secondary rounded-xl font-bold text-sm shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
          >
            {isVerifying ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                <span>Memvalidasi Data Disdukcapil...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">verified</span>
                <span>Aktifkan Subsidi Banyumas</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
