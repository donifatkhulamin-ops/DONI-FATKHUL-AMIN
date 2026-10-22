import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Subsidi Tarif Pelajar 100% Aktif',
      time: '15 menit lalu',
      desc: 'Pelajar dan mahasiswa yang telah memverifikasi NIK/KTP dapat menikmati gratis tarif Trans Banyumas di semua koridor.',
      type: 'info',
      icon: 'school',
    },
    {
      id: 'notif-2',
      title: 'Titik Transit Baru di Halte Alun-Alun',
      time: '1 jam lalu',
      desc: 'Shelter mitra ojek online (Gojek & Grab) dan angkot kini beroperasi di gerbang timur Alun-Alun Purwokerto.',
      type: 'success',
      icon: 'two_wheeler',
    },
    {
      id: 'notif-3',
      title: 'Jadwal Akhir Pekan Koridor 2 Baturraden',
      time: 'Kemarin',
      desc: 'Penambahan 4 armada bus koridor 2 tujuan Kawasan Wisata Baturraden untuk mengantisipasi lonjakan wisatawan.',
      type: 'update',
      icon: 'directions_bus',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl border border-outline-variant/50 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3.5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications</span>
            <h3 className="font-bold text-on-surface font-headline text-base">Notifikasi & Informasi</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="divide-y divide-outline-variant/20 max-h-[60vh] overflow-y-auto">
          {notifications.map((item) => (
            <div key={item.id} className="p-3.5 hover:bg-surface-container-low/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-sm font-bold text-on-surface truncate">{item.title}</h4>
                    <span className="text-[10px] text-outline shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-surface-container-low border-t border-outline-variant/30 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-container transition-colors cursor-pointer"
          >
            Tutup Notifikasi
          </button>
        </div>
      </div>
    </div>
  );
};
