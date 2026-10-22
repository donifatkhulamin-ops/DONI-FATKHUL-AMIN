import React, { useState } from 'react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onTopUpSuccess: (amount: number) => void;
}

export const TopUpModal: React.FC<TopUpModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onTopUpSuccess,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(20000);
  const [selectedMethod, setSelectedMethod] = useState<string>('qris');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const amounts = [10000, 20000, 50000, 100000];

  const handleTopUp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        onTopUpSuccess(selectedAmount);
        setShowSuccess(false);
        onClose();
      }, 1200);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl border border-outline-variant/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <h3 className="font-bold text-on-surface font-headline text-base">Top-Up BanyumasPay</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {showSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-secondary-container text-secondary mx-auto flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h4 className="font-headline font-bold text-lg text-on-surface">Top-Up Berhasil!</h4>
            <p className="text-sm text-on-surface-variant">
              Saldo sebesar <strong>Rp {selectedAmount.toLocaleString('id-ID')}</strong> telah ditambahkan ke BanyumasPay Anda.
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-on-surface-variant block">Saldo Saat Ini</span>
                <span className="text-lg font-bold text-primary font-headline">
                  Rp {currentBalance.toLocaleString('id-ID')}
                </span>
              </div>
              <span className="text-xs bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-semibold">
                Aktif
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Pilih Nominal Top-Up</label>
              <div className="grid grid-cols-2 gap-2">
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      selectedAmount === amt
                        ? 'border-primary bg-primary text-on-primary shadow-sm'
                        : 'border-outline-variant/60 bg-surface-container-lowest text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    Rp {amt.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-2">Metode Pembayaran</label>
              <div className="space-y-1.5">
                {[
                  { id: 'qris', name: 'QRIS Terpadu (Instan)', icon: 'qr_code_2' },
                  { id: 'bca', name: 'Virtual Account BCA / BRI', icon: 'account_balance' },
                  { id: 'minimarket', name: 'Indomaret / Alfamart', icon: 'storefront' },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedMethod === m.id
                        ? 'border-primary bg-primary-fixed/20'
                        : 'border-outline-variant/40 hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="topup_method"
                        checked={selectedMethod === m.id}
                        onChange={() => setSelectedMethod(m.id)}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-semibold text-on-surface">{m.name}</span>
                    </div>
                    <span className="material-symbols-outlined text-primary text-lg">{m.icon}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleTopUp}
              disabled={isProcessing}
              className="w-full py-3 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                  <span>Memproses Top-Up...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  <span>Bayar Rp {selectedAmount.toLocaleString('id-ID')}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
