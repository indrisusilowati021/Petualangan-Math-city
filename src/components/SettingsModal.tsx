import React from 'react';
import { Volume2, VolumeX, Sliders, Keyboard, HelpCircle, X, RotateCcw } from 'lucide-react';
import { GameSettings } from '../types/game';
import { soundManager } from '../audio/soundManager';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold font-['Fredoka']">Pengaturan & Bantuan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5 text-slate-200 overflow-y-auto max-h-[75vh]">
          {/* Audio Settings */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Audio & Suara
            </h3>

            {/* BGM Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Musik Latar (BGM)</span>
                <span className="font-mono text-amber-300">{Math.round(settings.bgmVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.bgmVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings({ bgmVolume: val });
                  soundManager.setVolumes(val, settings.sfxVolume);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* SFX Volume */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Efek Suara (SFX)</span>
                <span className="font-mono text-amber-300">{Math.round(settings.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.sfxVolume}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onUpdateSettings({ sfxVolume: val });
                  soundManager.setVolumes(settings.bgmVolume, val);
                  soundManager.playCoin();
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Control Guide */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4" /> Panduan Kontrol Karakter
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <span className="text-amber-300 font-mono font-bold block mb-0.5">W, A, S, D / Panah</span>
                <span className="text-slate-400">Bergerak menjelajahi kota</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <span className="text-amber-300 font-mono font-bold block mb-0.5">SPASI (Space)</span>
                <span className="text-slate-400">Melompat</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <span className="text-amber-300 font-mono font-bold block mb-0.5">SHIFT</span>
                <span className="text-slate-400">Berlari kencang (Sprint)</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <span className="text-amber-300 font-mono font-bold block mb-0.5">Tombol E</span>
                <span className="text-slate-400">Berbicara dengan Warga / NPC</span>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 col-span-2">
                <span className="text-amber-300 font-mono font-bold block mb-0.5">Mouse Drag / Sentuh Layar</span>
                <span className="text-slate-400">Mengatur sudut kamera 3D 360° & Zoom Scroll</span>
              </div>
            </div>
          </div>

          {/* Reset Game Data */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-rose-400">Mulai Ulang Permainan</div>
              <div className="text-[11px] text-slate-500">Mereset progres koin, lencana, dan misi.</div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Apakah kamu yakin ingin mereset seluruh progres permainan?')) {
                  onResetProgress();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-300 text-xs font-bold transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Progres
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
          Math City: The Lost Price • Game Edukasi Aljabar SPLDV
        </div>
      </div>
    </div>
  );
};
