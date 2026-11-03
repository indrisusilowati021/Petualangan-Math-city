import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Coins, Download, RefreshCw, Sparkles, Star, Trophy, X } from 'lucide-react';
import { PlayerStats } from '../types/game';
import { soundManager } from '../audio/soundManager';

interface VictoryEvaluationModalProps {
  stats: PlayerStats;
  onClose: () => void;
  onRestart: () => void;
}

export const VictoryEvaluationModal: React.FC<VictoryEvaluationModalProps> = ({
  stats,
  onClose,
  onRestart,
}) => {
  useEffect(() => {
    soundManager.playVictory();
    // Burst multi-color confetti
    const end = Date.now() + 3000;
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const printCertificate = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border-4 border-amber-500 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto animate-fadeIn text-slate-100">
        
        {/* Certificate Golden Top Frame */}
        <div className="p-6 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 text-center relative shadow-lg">
          <div className="inline-block p-3 rounded-2xl bg-slate-950/20 backdrop-blur-sm text-4xl mb-2">
            🏆
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka'] tracking-wide">
            SELAMAT! KOTA MATH CITY TERSELAMATKAN!
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-900 max-w-md mx-auto mt-1">
            Seluruh misteri hilangnya label harga telah berhasil dipecahkan dengan pemodelan Sistem Persamaan Linear Dua Variabel (SPLDV).
          </p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-black/20 hover:bg-black/30 text-slate-900 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Official Badge Card */}
          <div className="bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-amber-500/50 rounded-2xl p-6 text-center space-y-3 relative shadow-inner">
            <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
              SERTIFIKAT KELULUSAN AKADEMI DETEKTIF MATEMATIKA
            </span>

            <h3 className="text-3xl font-extrabold text-white font-['Fredoka']">
              {stats.playerName}
            </h3>

            <p className="text-sm text-slate-300">
              Dianugerahi Gelar Kehormatan Tertinggi:
            </p>
            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-base shadow font-['Fredoka']">
              ★ Detektif Legendaris Math City ★
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-left">
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Total Koin</span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {stats.coins.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Bintang</span>
                <span className="text-base font-bold text-yellow-300 font-mono">
                  {stats.starsTotal} ★
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Kasus Dipecahkan</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {stats.solvedChallengeIds.length} Kasus
                </span>
              </div>
              <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Waktu Bermain</span>
                <span className="text-base font-bold text-cyan-400 font-mono">
                  {Math.floor(stats.timePlayedSeconds / 60)}m {stats.timePlayedSeconds % 60}s
                </span>
              </div>
            </div>
          </div>

          {/* Evaluasi Kemampuan SPLDV */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Evaluasi Kompetensi Aljabar SPLDV
            </h4>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>1. Kemampuan Mengidentifikasi Variabel & Pemodelan</span>
                  <span className="text-emerald-400 font-bold font-mono">100% (Mahir)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>2. Penguasaan Strategi Aljabar (Eliminasi & Substitusi)</span>
                  <span className="text-emerald-400 font-bold font-mono">98% (Sangat Baik)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[98%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-medium mb-1">
                  <span>3. Visualisasi & Interpretasi Titik Potong Grafik Kartesius</span>
                  <span className="text-emerald-400 font-bold font-mono">95% (Akurat)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[95%]" />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 italic pt-1">
              "Pemain menunjukkan pemahaman konseptual yang sangat kuat mengenai hubungan linier, sifat perpotongan dua garis lurus, dan aplikasi nyata SPLDV dalam kehidupan sehari-hari."
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={printCertificate}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Cetak Sertifikat
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRestart}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Main Ulang
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow transition font-['Fredoka'] cursor-pointer"
            >
              Jelajahi Kota Bebas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
