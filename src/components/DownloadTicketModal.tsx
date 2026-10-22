import React, { useState } from 'react';
import { UserTicket } from '../types.ts';

interface DownloadTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: UserTicket;
}

export const DownloadTicketModal: React.FC<DownloadTicketModalProps> = ({
  isOpen,
  onClose,
  ticket,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest w-full max-w-sm rounded-2xl border border-outline-variant/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-4 py-3 border-b border-outline-variant/30 flex items-center justify-between bg-primary text-on-primary">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">receipt_long</span>
            <h3 className="font-bold font-headline text-base">E-Tiket Terpadu Banyumas</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="p-4 space-y-3.5 bg-surface-container-low">
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/50 shadow-sm space-y-3 text-center">
            <div className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-xs font-bold">
              Tiket Sah Dishub Kab. Banyumas
            </div>
            <div>
              <span className="text-[10px] text-outline uppercase tracking-wider block font-bold">
                KODE BOARDING PASS
              </span>
              <span className="text-xl font-headline font-extrabold text-primary tracking-wider">
                {ticket.ticketId}
              </span>
            </div>

            <div className="pt-2 border-t border-dashed border-outline-variant text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Rute:</span>
                <span className="font-bold text-on-surface">{ticket.origin} ➔ {ticket.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Berlaku Sampai:</span>
                <span className="font-bold text-primary">{ticket.expiresAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Status:</span>
                <span className="font-bold text-secondary">Terkonfirmasi (Aktif)</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-outline-variant/30">
                <span className="text-on-surface-variant font-bold">Total Pembayaran:</span>
                <span className="font-extrabold text-primary text-sm">
                  Rp {ticket.totalFare.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
            </button>
            <button
              onClick={() => {
                alert('E-Tiket berhasil disimpan ke galeri dokumen Anda.');
                onClose();
              }}
              className="py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              <span>Unduh PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
