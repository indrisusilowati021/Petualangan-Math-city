import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Compass, 
  HelpCircle, 
  Lock, 
  MapPin, 
  Sparkles, 
  Star, 
  TrendingUp, 
  X,
  Calculator,
  Timer
} from 'lucide-react';
import { AreaId, PlayerStats } from '../types/game';
import { AREAS_INFO, MISSIONS_DATA } from '../data/missionsData';
import { soundManager } from '../audio/soundManager';

interface DetectiveNotebookModalProps {
  stats: PlayerStats;
  onClose: () => void;
  onTeleport: (areaId: AreaId) => void;
}

export const DetectiveNotebookModal: React.FC<DetectiveNotebookModalProps> = ({
  stats,
  onClose,
  onTeleport,
}) => {
  const [activeTab, setActiveTab] = useState<'cases' | 'badges' | 'guide' | 'stats'>('cases');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Notebook Cover / Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-amber-100 flex items-center justify-between border-b-2 border-amber-500/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-950/40 flex items-center justify-center text-3xl shadow">
              📖
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Dokumen Resmi Detektif Math City
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Fredoka'] text-white">
                Buku Catatan Kasus & Rumus SPLDV
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-4 pt-2 gap-1 overflow-x-auto">
          {[
            { id: 'cases', label: 'Status 5 Area', icon: MapPin },
            { id: 'badges', label: 'Lencana Kehormatan', icon: Award },
            { id: 'guide', label: 'Panduan Materi SPLDV', icon: BookOpen },
            { id: 'stats', label: 'Statistik Detektif', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as typeof activeTab);
                  soundManager.playClick();
                }}
                className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-amber-400 border-t-2 border-x border-amber-500/80'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 text-slate-200">
          
          {/* TAB 1: CASES STATUS */}
          {activeTab === 'cases' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-300">
                Kota Math City terbagi menjadi 5 area utama. Selesaikan seluruh 5 kasus di masing-masing lokasi untuk memulihkan kestabilan harga kota:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {Object.values(AREAS_INFO).map((area) => {
                  const areaMissions = MISSIONS_DATA.filter((m) => m.areaId === area.id);
                  const solvedInArea = areaMissions.filter((m) => stats.solvedChallengeIds.includes(m.id)).length;
                  const isFinished = solvedInArea === 5;

                  return (
                    <div
                      key={area.id}
                      className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3 hover:border-slate-700 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{area.badgeIcon}</span>
                            <div>
                              <h4 className="font-bold text-white font-['Fredoka']">{area.name}</h4>
                              <p className="text-xs text-slate-400">{area.npcName} ({area.npcRole})</p>
                            </div>
                          </div>
                          {isFinished ? (
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Tuntas
                            </span>
                          ) : (
                            <span className="text-xs font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                              {solvedInArea}/5 Kasus
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                          {area.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          Reward: Lencana <strong>{area.badgeName}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onTeleport(area.id);
                            onClose();
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs rounded-lg transition flex items-center gap-1"
                        >
                          <Compass className="w-3.5 h-3.5" /> Kunjungi
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BADGES */}
          {activeTab === 'badges' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-slate-300">
                Lencana prestisius diberikan atas dedikasimu dalam membongkar misteri harga di Math City:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {Object.values(AREAS_INFO).map((area) => {
                  const areaMissions = MISSIONS_DATA.filter((m) => m.areaId === area.id);
                  const isUnlocked = areaMissions.every((m) => stats.solvedChallengeIds.includes(m.id));

                  return (
                    <div
                      key={area.id}
                      className={`rounded-xl border p-4 text-center flex flex-col items-center justify-center gap-2 transition ${
                        isUnlocked
                          ? 'bg-gradient-to-b from-amber-500/20 to-slate-900 border-amber-500/80 shadow-lg'
                          : 'bg-slate-950/40 border-slate-800 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-md ${
                          isUnlocked ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {isUnlocked ? area.badgeIcon : <Lock className="w-6 h-6 text-slate-500" />}
                      </div>

                      <div>
                        <h4 className="font-bold text-sm text-white font-['Fredoka'] mt-1">
                          {area.badgeName}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {area.badgeDescription}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                          isUnlocked
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isUnlocked ? '★ TERBUKA' : 'TERKUNCI (Selesaikan 5 Misi)'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SPLDV GUIDEBOOK */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <h4 className="font-bold text-amber-400 text-base mb-1 font-['Fredoka']">
                  Apa itu SPLDV (Sistem Persamaan Linear Dua Variabel)?
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  SPLDV adalah kesatuan dari dua persamaan linear yang masing-masing memiliki dua variabel berpangkat satu (umumnya disimbolkan sebagai $x$ dan $y$). Bentuk umumnya:
                </p>
                <div className="my-2 p-2.5 bg-slate-900 border border-slate-700 font-mono text-emerald-400 rounded-lg text-center">
                  ax + by = c<br />
                  dx + ey = f
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-xs font-bold text-amber-400 uppercase block">1. Metode Eliminasi</span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Menghilangkan salah satu variabel dengan cara menyamakan koefisiennya terlebih dahulu melalui perkalian silang, kemudian menjumlahkan atau mengurangkan kedua persamaan.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-xs font-bold text-cyan-400 uppercase block">2. Metode Substitusi</span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Menyatakan salah satu variabel ke dalam bentuk variabel lainnya (contoh: $y = c - ax$), kemudian memasukkannya (menggantikannya) ke persamaan kedua.
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 uppercase block">3. Metode Grafik</span>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Menggambar kedua garis lurus persamaan pada bidang Kartesius. Titik temu atau titik perpotongan $(x, y)$ dari kedua garis merupakan himpunan penyelesaiannya.
                  </p>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 text-xs text-amber-200">
                🔍 <strong>Tips Detektif:</strong> Selalu cek kembali hasil perhitunganmu dengan memasukkan nilai $x$ dan $y$ ke persamaan (1) maupun (2) untuk memastikan nilai totalnya cocok dengan harga pada nota!
              </div>
            </div>
          )}

          {/* TAB 4: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="text-xs text-slate-400 block">Total Koin</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400">
                    {stats.coins.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="text-xs text-slate-400 block">Bintang Detektif</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-yellow-300">
                    {stats.starsTotal} ★
                  </span>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="text-xs text-slate-400 block">Misi Tuntas</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {stats.solvedChallengeIds.length} / 25
                  </span>
                </div>
                <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl text-center">
                  <span className="text-xs text-slate-400 block">Waktu Bermain</span>
                  <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">
                    {Math.floor(stats.timePlayedSeconds / 60)}m {stats.timePlayedSeconds % 60}s
                  </span>
                </div>
              </div>

              {/* Progress Bar of whole game */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Penyelesaian Kasus Math City:</span>
                  <span className="text-amber-400 font-mono">
                    {Math.round((stats.solvedChallengeIds.length / 25) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${(stats.solvedChallengeIds.length / 25) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
          Math City Detective Academy • Arsip Berkas Tersimpan Otomatis
        </div>
      </div>
    </div>
  );
};
