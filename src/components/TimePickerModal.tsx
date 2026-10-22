import React, { useState } from 'react';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTime: string;
  onTimeSelected: (timeStr: string) => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  isOpen,
  onClose,
  currentTime,
  onTimeSelected,
}) => {
  const [mode, setMode] = useState<'now' | 'custom'>('now');
  const [hour, setHour] = useState('08');
  const [minute, setMinute] = useState('30');

  if (!isOpen) return null;

  const handleApply = () => {
    if (mode === 'now') {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      onTimeSelected(`Berangkat Sekarang (${h}:${m} WIB)`);
    } else {
      onTimeSelected(`Berangkat Jam ${hour}:${minute} WIB`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl border border-outline-variant/60 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">schedule</span>
            <h3 className="font-bold text-on-surface font-headline text-base">Waktu Keberangkatan</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <label
              onClick={() => setMode('now')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                mode === 'now'
                  ? 'border-primary bg-primary-fixed/20'
                  : 'border-outline-variant/40 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="time_mode"
                  checked={mode === 'now'}
                  onChange={() => setMode('now')}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-bold text-on-surface block">Berangkat Sekarang</span>
                  <span className="text-xs text-on-surface-variant">Estimasi rute tercepat berdasarkan armada live</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-secondary">bolt</span>
            </label>

            <label
              onClick={() => setMode('custom')}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                mode === 'custom'
                  ? 'border-primary bg-primary-fixed/20'
                  : 'border-outline-variant/40 hover:bg-surface-container-low'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="time_mode"
                  checked={mode === 'custom'}
                  onChange={() => setMode('custom')}
                  className="text-primary focus:ring-primary"
                />
                <div>
                  <span className="text-sm font-bold text-on-surface block">Pilih Jam Tertentu</span>
                  <span className="text-xs text-on-surface-variant">Jadwalkan perjalanan Anda nanti</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-primary">event_upcoming</span>
            </label>
          </div>

          {mode === 'custom' && (
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/40 flex items-center justify-center gap-3">
              <div className="flex flex-col items-center">
                <label className="text-[10px] text-on-surface-variant mb-1 font-bold">JAM</label>
                <select
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-base font-bold text-primary"
                >
                  {Array.from({ length: 15 }, (_, i) => String(i + 5).padStart(2, '0')).map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-xl font-bold text-on-surface mt-4">:</span>
              <div className="flex flex-col items-center">
                <label className="text-[10px] text-on-surface-variant mb-1 font-bold">MENIT</label>
                <select
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-base font-bold text-primary"
                >
                  {['00', '10', '15', '20', '30', '40', '45', '50'].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <span className="text-xs font-bold text-on-surface-variant mt-4">WIB</span>
            </div>
          )}

          <button
            onClick={handleApply}
            className="w-full py-2.5 bg-primary hover:bg-primary-container text-on-primary rounded-xl font-bold text-sm shadow-sm transition-all active:scale-98 cursor-pointer"
          >
            Terapkan Waktu
          </button>
        </div>
      </div>
    </div>
  );
};
