import React, { useState } from 'react';
import { Play, HelpCircle, Sliders, Sparkles, BookOpen, ChevronRight, X, Volume2, Shield } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface HomeScreenProps {
  onStartGame: (playerName: string) => void;
  onOpenSettings: () => void;
  defaultPlayerName: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onOpenSettings,
  defaultPlayerName,
}) => {
  const [playerName, setPlayerName] = useState(defaultPlayerName);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handlePlay = () => {
    soundManager.playCorrect();
    soundManager.startBGM();
    onStartGame(playerName.trim() || 'Detektif Cilik');
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-between p-4 sm:p-8 bg-slate-950/45 backdrop-blur-[2px] select-none pointer-events-none">
      
      {/* Top Tag & Version */}
      <div className="pointer-events-auto flex items-center justify-between w-full max-w-5xl">
        <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-700/80 px-3.5 py-1.5 rounded-full shadow-lg backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Game Edukasi 3D • Aljabar SPLDV
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white shadow-lg backdrop-blur-md hover:bg-slate-800 transition"
          title="Pengaturan"
        >
          <Sliders className="w-5 h-5" />
        </button>
      </div>

      {/* Main Center Banner */}
      <div className="pointer-events-auto flex flex-col items-center text-center max-w-2xl px-4 animate-fadeIn">
        {/* Detective Fedora Icon Emblem */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-1 shadow-2xl flex items-center justify-center mb-4 transform hover:scale-105 transition-transform">
          <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl sm:text-5xl">
            🕵️‍♂️
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Petualangan Detektif Matematika
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-['Fredoka'] tracking-tight drop-shadow-xl">
          MATH CITY
        </h1>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Fredoka'] tracking-wide drop-shadow-md -mt-1">
          THE LOST PRICE
        </h2>

        <p className="text-xs sm:text-base text-slate-200 mt-3 max-w-lg leading-relaxed drop-shadow bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 backdrop-blur-sm">
          Semua label harga di Math City lenyap secara misterius! Jelajahi kota virtual 3D, kumpulkan petunjuk dari warga, dan temukan harga barang dengan konsep <strong>SPLDV</strong>!
        </p>

        {/* Player Name Input */}
        <div className="mt-5 w-full max-w-xs space-y-1">
          <label className="block text-xs font-bold text-slate-300 text-left">
            Nama Detektif:
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Masukkan nama..."
            maxLength={18}
            className="w-full px-4 py-2.5 bg-slate-900/90 border-2 border-amber-500/60 rounded-xl text-center text-white font-bold text-base focus:outline-none focus:border-amber-400 shadow-inner"
          />
        </div>

        {/* Main CTA Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          <button
            type="button"
            onClick={handlePlay}
            className="w-full py-4 px-8 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-lg rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition transform flex items-center justify-center gap-2.5 font-['Fredoka'] cursor-pointer border-2 border-amber-300"
          >
            <Play className="w-6 h-6 fill-slate-950" />
            PLAY NOW
          </button>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShowHowToPlay(true);
              soundManager.playClick();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            HOW TO PLAY
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            SETTINGS
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pointer-events-auto text-center text-xs text-slate-300/80 bg-slate-950/70 px-4 py-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
        Gunakan tombol <kbd className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded font-mono">WASD</kbd> untuk berjalan • <kbd className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded font-mono">E</kbd> untuk berinteraksi dengan NPC
      </div>

      {/* HOW TO PLAY MODAL */}
      {showHowToPlay && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[85vh] text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-white font-['Fredoka'] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Cara Bermain & Panduan SPLDV
              </h3>
              <button
                onClick={() => setShowHowToPlay(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm leading-relaxed">
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-amber-400 block mb-1">1. Jelajahi Kota Math City</span>
                <p>
                  Kendalikan karakter detektif menggunakan tombol <strong>WASD / Panah</strong>, tekan <strong>SPASI</strong> untuk melompat, dan <strong>SHIFT</strong> untuk berlari. Di perangkat tablet/ponsel, gunakan joystick di layar.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-1">2. Bicara dengan Warga di 5 Area</span>
                <p>
                  Dekati NPC (Pak Joko di Supermarket, Chef Sarah di Restoran, Mas Budi di Stasiun, Pak Doni di Taman Hiburan, Inspektur Hendra di Markas) lalu tekan tombol <strong>[E]</strong>.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-1">3. Pecahkan SPLDV Bertahap</span>
                <p>
                  Baca 2 petunjuk dari nota atau transaksi warga. Susun dua persamaan linear ($a_1x + b_1y = c_1$ dan $a_2x + b_2y = c_2$). Gunakan <strong>Metode Eliminasi</strong>, <strong>Metode Substitusi</strong>, atau amati <strong>Grafik Kartesius Interaktif</strong> untuk menemukan harga barang.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                <span className="font-bold text-yellow-300 block mb-1">4. Kumpulkan Koin & Buka Lencana</span>
                <p>
                  Kumpulkan koin emas yang tersebar di taman dan jalanan. Selesaikan semua tantangan untuk mendapatkan 5 Lencana Kehormatan dan Sertifikat Detektif Resmi!
                </p>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setShowHowToPlay(false)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm font-['Fredoka']"
              >
                Saya Mengerti, Ayo Mulai!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
