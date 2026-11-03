import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  HelpCircle, 
  Lightbulb, 
  PenTool, 
  Sparkles, 
  X, 
  Calculator, 
  TrendingUp, 
  ArrowRight,
  ShieldAlert,
  Award
} from 'lucide-react';
import { SPLDVChallenge, AreaId } from '../types/game';
import { AREAS_INFO } from '../data/missionsData';
import { CartesianGraph } from './CartesianGraph';
import { DetectiveScratchpad } from './DetectiveScratchpad';
import { soundManager } from '../audio/soundManager';

interface SPLDVMissionModalProps {
  challenge: SPLDVChallenge;
  isSolvedAlready: boolean;
  onClose: () => void;
  onSolveSuccess: (challengeId: string, earnedCoins: number, earnedXP: number, earnedStars: number) => void;
  onNextChallenge?: () => void;
  hasNextChallenge?: boolean;
}

export const SPLDVMissionModal: React.FC<SPLDVMissionModalProps> = ({
  challenge,
  isSolvedAlready,
  onClose,
  onSolveSuccess,
  onNextChallenge,
  hasNextChallenge,
}) => {
  const area = AREAS_INFO[challenge.areaId];

  // Learning workflow state
  const [activeTab, setActiveTab] = useState<'methods' | 'graph' | 'scratchpad' | 'solution'>('methods');
  const [chosenMethod, setChosenMethod] = useState<'elimination' | 'substitution'>('elimination');
  const [showScratchpad, setShowScratchpad] = useState<boolean>(false);
  const [showFullSolution, setShowFullSolution] = useState<boolean>(isSolvedAlready);

  // Form input answers
  const [inputX, setInputX] = useState<string>('');
  const [inputY, setInputY] = useState<string>('');
  const [attempts, setAttempts] = useState<number>(0);
  const [hintsUnlocked, setHintsUnlocked] = useState<number>(0);
  
  // Evaluation state
  const [isSuccess, setIsSuccess] = useState<boolean>(isSolvedAlready);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const valX = parseInt(inputX.replace(/\D/g, ''), 10);
    const valY = parseInt(inputY.replace(/\D/g, ''), 10);

    if (isNaN(valX) || isNaN(valY)) {
      setErrorMessage('Mohon masukkan angka harga yang valid untuk kedua barang (tanpa titik atau tanda baca)!');
      soundManager.playWrong();
      return;
    }

    setAttempts((prev) => prev + 1);

    if (valX === challenge.correctX && valY === challenge.correctY) {
      // Correct!
      setIsSuccess(true);
      setShowFullSolution(true);
      setErrorMessage(null);
      soundManager.playCorrect();

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Calculate star rating (3 stars if <= 2 attempts, 2 stars if <= 4, 1 star otherwise)
      const stars = attempts <= 1 ? 3 : attempts <= 3 ? 2 : 1;
      const coins = 100 + stars * 25;
      const xp = 150 + stars * 30;

      onSolveSuccess(challenge.id, coins, xp, stars);
    } else {
      // Incorrect - provide diagnostic feedback without spoiling answers!
      soundManager.playWrong();
      
      let diagnostic = '';
      if (valX === challenge.correctX && valY !== challenge.correctY) {
        diagnostic = `Bagus! Harga 1 ${challenge.itemXName} (x) sudah tepat. Namun harga 1 ${challenge.itemYName} (y) masih belum tepat. Periksa kembali saat kamu mensubstitusikan nilai x ke persamaan!`;
      } else if (valX !== challenge.correctX && valY === challenge.correctY) {
        diagnostic = `Harga 1 ${challenge.itemYName} (y) sudah tepat! Namun harga 1 ${challenge.itemXName} (x) masih belum tepat. Periksa kembali langkah eliminasi atau pembagiannya!`;
      } else {
        const hintIdx = Math.min(hintsUnlocked, challenge.hints.length - 1);
        diagnostic = `Kedua harga masih belum tepat. ${challenge.hints[hintIdx]}`;
        if (hintsUnlocked < challenge.hints.length) {
          setHintsUnlocked((prev) => prev + 1);
        }
      }
      
      setErrorMessage(diagnostic);
    }
  };

  const unlockNextHint = () => {
    if (hintsUnlocked < challenge.hints.length) {
      setHintsUnlocked((prev) => prev + 1);
      soundManager.playClick();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header Bar */}
        <div className={`p-4 bg-gradient-to-r ${area.colorTheme} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 bg-black/20 rounded-xl backdrop-blur-sm">
              {area.badgeIcon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider bg-black/30 px-2.5 py-0.5 rounded-full">
                  {area.name} – {challenge.difficulty}
                </span>
                {isSolvedAlready && (
                  <span className="text-xs font-bold bg-emerald-500/90 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-['Fredoka'] mt-0.5">
                {challenge.title}
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

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-100 flex-1">
          
          {/* NPC Clue Box */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex-1 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Kasus dari {area.npcName} ({area.npcRole}):
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                "{challenge.contextStory}"
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs sm:text-sm">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-amber-500/30 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span>
                  <span><strong>Petunjuk 1:</strong> {challenge.clue1Text}</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-cyan-500/30 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0"></span>
                  <span><strong>Petunjuk 2:</strong> {challenge.clue2Text}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Matematika (Step 1 & 2) */}
          <div className="bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700 rounded-xl p-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Langkah 1 & 2: Pemodelan Matematika SPLDV
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1 font-semibold">1. Identifikasi Variabel:</span>
                <p>• <strong>x</strong> = Harga 1 {challenge.itemXName} ({challenge.itemXUnit})</p>
                <p>• <strong>y</strong> = Harga 1 {challenge.itemYName} ({challenge.itemYUnit})</p>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block mb-1 font-semibold">2. Sistem Persamaan Linear:</span>
                <p className="font-mono text-amber-300 font-semibold">
                  (1) {challenge.eq1.a}x + {challenge.eq1.b}y = Rp{challenge.eq1.c.toLocaleString('id-ID')}
                </p>
                <p className="font-mono text-cyan-300 font-semibold">
                  (2) {challenge.eq2.a}x + {challenge.eq2.b}y = Rp{challenge.eq2.c.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs: Panduan Metode vs Grafik Kartesius vs Scratchpad vs Pembahasan */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('methods')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'methods'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Calculator className="w-4 h-4" /> Panduan Langkah Aljabar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('graph')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'graph'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" /> Grafik Kartesius
                </button>
                {(isSuccess || attempts >= 3) && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('solution')}
                    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center gap-1.5 ${
                      activeTab === 'solution'
                        ? 'bg-emerald-500 text-slate-950'
                        : 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> Pembahasan Rinci
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowScratchpad(!showScratchpad)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  showScratchpad ? 'bg-purple-600 text-white' : 'bg-slate-800 text-purple-300 hover:bg-slate-700'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                {showScratchpad ? 'Tutup Papan Coret' : 'Buka Papan Coret-Coret'}
              </button>
            </div>

            {/* Optional Scratchpad Canvas */}
            {showScratchpad && (
              <div className="animate-fadeIn">
                <DetectiveScratchpad />
              </div>
            )}

            {/* TAB 1: GUIDED ALGEBRA METHODS (WITHOUT SPOILING FINAL ANSWER!) */}
            {activeTab === 'methods' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Pilih Metode Aljabar yang Ingin Kamu Gunakan:</span>
                  <button
                    type="button"
                    onClick={() => setChosenMethod('elimination')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                      chosenMethod === 'elimination'
                        ? 'bg-amber-500/20 border border-amber-500 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Metode Eliminasi
                  </button>
                  <button
                    type="button"
                    onClick={() => setChosenMethod('substitution')}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                      chosenMethod === 'substitution'
                        ? 'bg-cyan-500/20 border border-cyan-500 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Metode Substitusi
                  </button>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
                  {chosenMethod === 'elimination' ? (
                    <>
                      <div className="border-l-2 border-amber-500/80 pl-3 py-1">
                        <h4 className="text-xs font-bold text-amber-300 uppercase">
                          Langkah 1: Samakan Salah Satu Koefisien Variabel
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1">
                          Kalikan kedua persamaan dengan bilangan tertentu sehingga koefisien dari <strong>x</strong> atau <strong>y</strong> menjadi bernilai sama.
                        </p>
                        <div className="mt-1.5 p-2 bg-slate-900 rounded font-mono text-xs text-amber-300 border border-slate-800">
                          (1) {challenge.eq1.a}x + {challenge.eq1.b}y = {challenge.eq1.c.toLocaleString('id-ID')}<br />
                          (2) {challenge.eq2.a}x + {challenge.eq2.b}y = {challenge.eq2.c.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div className="border-l-2 border-amber-500/80 pl-3 py-1">
                        <h4 className="text-xs font-bold text-amber-300 uppercase">
                          Langkah 2: Lakukan Eliminasi (Pengurangan / Penjumlahan)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1">
                          Kurangkan kedua baris persamaan yang telah dikalikan tadi agar variabel dengan koefisien yang sama hilang (tereliminasi). Hitung berapa nilai variabel yang tersisa!
                        </p>
                        <div className="mt-1.5 p-2 bg-slate-900 rounded font-mono text-xs text-slate-400 border border-slate-800">
                          Hasil pengurangan menghasilkan satu variabel: [ ... ] = [ ... ] ⇒ Hitung nilainya di Papan Coret-Coret!
                        </div>
                      </div>

                      <div className="border-l-2 border-amber-500/80 pl-3 py-1">
                        <h4 className="text-xs font-bold text-amber-300 uppercase">
                          Langkah 3: Substitusi Nilai Pertama ke Persamaan Awal
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1">
                          Setelah menemukan nilai salah satu variabel, masukkan kembali nilai tersebut ke dalam persamaan (1) atau (2) untuk mendapatkan nilai variabel lainnya.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border-l-2 border-cyan-500/80 pl-3 py-1">
                        <h4 className="text-xs font-bold text-cyan-300 uppercase">
                          Langkah 1: Nyatakan Salah Satu Variabel dalam Bentuk Lain
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1">
                          Pilihlah persamaan yang koefisiennya paling sederhana (misalnya koefisien bernilai 1), lalu nyatakan variabel tersebut:
                        </p>
                        <div className="mt-1.5 p-2 bg-slate-900 rounded font-mono text-xs text-cyan-300 border border-slate-800">
                          Contoh: Dari persamaan (1), nyatakan variabel sebagai fungsi dari variabel lain.
                        </div>
                      </div>

                      <div className="border-l-2 border-cyan-500/80 pl-3 py-1">
                        <h4 className="text-xs font-bold text-cyan-300 uppercase">
                          Langkah 2: Gantikan (Substitusikan) ke Persamaan Kedua
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1">
                          Masukkan bentuk variabel baru tersebut ke dalam persamaan kedua sehingga persamaan tersebut hanya memiliki 1 jenis variabel saja!
                        </p>
                      </div>

                      <div className="border-l-2 border-cyan-500/80 pl-3 py-1">
                        <h4 className="text-xs font-bold text-cyan-300 uppercase">
                          Langkah 3: Selesaikan dan Hitung Kedua Variabel
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 mt-1">
                          Hitung hasil nilai variabel pertama, lalu cari nilai variabel kedua dengan memasukkan angka yang diperoleh.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span>💡 <em>Gunakan Papan Coret-Coret untuk menulis langkah aljabar dan menghitung hasilnya!</em></span>
                  <button
                    type="button"
                    onClick={() => setShowScratchpad(true)}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Buka Papan Coret ➔
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CARTESIAN GRAPH (WITHOUT SPOILING NUMBERS) */}
            {activeTab === 'graph' && (
              <div>
                <CartesianGraph
                  eq1={challenge.eq1}
                  eq2={challenge.eq2}
                  correctX={challenge.correctX}
                  correctY={challenge.correctY}
                  labelX={challenge.itemXName}
                  labelY={challenge.itemYName}
                  isSolved={isSuccess}
                />
                <p className="text-xs text-slate-300 mt-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  {isSuccess
                    ? challenge.graphicExplanation
                    : 'Amati kedua garis aljabar di atas. Garis kuning mewakili Persamaan (1) dan garis biru mewakili Persamaan (2). Titik temu di mana kedua garis bersilangan adalah koordinat (x, y) yang sedang kamu cari!'}
                </p>
              </div>
            )}

            {/* TAB 3: FULL DETAILED SOLUTION (ONLY AFTER SUCCESS OR 3 ATTEMPTS) */}
            {activeTab === 'solution' && (
              <div className="bg-slate-950/80 border border-emerald-500/40 rounded-xl p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  Pembahasan Rinci & Pembuktian Kasus
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-amber-300 uppercase">
                    Penyelesaian Menggunakan Metode Eliminasi:
                  </h4>
                  {challenge.eliminationSteps.map((step, idx) => (
                    <div key={idx} className="border-l-2 border-emerald-500 pl-3 py-1">
                      <span className="text-xs font-bold text-slate-200">{step.title}</span>
                      <p className="text-xs text-slate-300 whitespace-pre-line mt-1">{step.explanation}</p>
                      {step.mathFormula && (
                        <div className="mt-1 p-2 bg-slate-900 rounded font-mono text-xs text-emerald-400 border border-slate-800">
                          {step.mathFormula}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Input Jawaban Detektif */}
          <div className="bg-slate-800/90 border-2 border-amber-500/40 rounded-xl p-4 sm:p-5">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Masukkan Hasil Penyelidikanmu:
            </h3>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Harga 1 {challenge.itemXName} (x):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="Masukkan angka..."
                      value={inputX}
                      onChange={(e) => setInputX(e.target.value)}
                      disabled={isSuccess}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-amber-400 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Harga 1 {challenge.itemYName} (y):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                      Rp
                    </span>
                    <input
                      type="number"
                      placeholder="Masukkan angka..."
                      value={inputY}
                      onChange={(e) => setInputY(e.target.value)}
                      disabled={isSuccess}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-400 disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* Error / Diagnostic Guidance Banner (Does NOT spoil the numbers!) */}
              {errorMessage && (
                <div className="bg-amber-950/80 border border-amber-500/50 p-3 rounded-lg text-amber-200 text-xs sm:text-sm flex items-start gap-2.5">
                  <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              {/* Success Banner */}
              {isSuccess && (
                <div className="bg-emerald-950/80 border-2 border-emerald-500 p-4 rounded-xl text-emerald-200 text-sm flex flex-col gap-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-base font-bold text-emerald-300">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    KASUS BERHASIL DIPECAHKAN! LABEL HARGA DIPULIHKAN!
                  </div>
                  <p className="text-xs text-emerald-100/90">
                    Perhitunganmu tepat! Harga 1 {challenge.itemXName} adalah <strong>Rp{challenge.correctX.toLocaleString('id-ID')}</strong> dan 1 {challenge.itemYName} adalah <strong>Rp{challenge.correctY.toLocaleString('id-ID')}</strong>.
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={unlockNextHint}
                  disabled={hintsUnlocked >= challenge.hints.length || isSuccess}
                  className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 disabled:opacity-50 transition"
                >
                  <Lightbulb className="w-4 h-4" />
                  Petunjuk Aljabar ({hintsUnlocked}/{challenge.hints.length})
                </button>

                <div className="flex items-center gap-2">
                  {!isSuccess ? (
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer font-['Fredoka'] text-sm sm:text-base"
                    >
                      <CheckCircle2 className="w-5 h-5" /> Periksa Jawaban
                    </button>
                  ) : (
                    <>
                      {hasNextChallenge && onNextChallenge && (
                        <button
                          type="button"
                          onClick={onNextChallenge}
                          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer font-['Fredoka'] text-sm"
                        >
                          Tantangan Berikutnya <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition text-sm"
                      >
                        Kembali Jelajahi Kota
                      </button>
                    </>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-400 flex items-center justify-between px-6">
          <span>Detektif SPLDV • Math City: The Lost Price</span>
          <span className="text-amber-400 font-mono">
            Percobaan: {attempts}
          </span>
        </div>
      </div>
    </div>
  );
};
