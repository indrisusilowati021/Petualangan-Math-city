import React, { useState } from 'react';
import { AreaId, SPLDVChallenge } from '../types/game';
import { AREAS_INFO, MISSIONS_DATA } from '../data/missionsData';
import { CheckCircle2, ChevronRight, Play, Star, X } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface NPCDialogueModalProps {
  areaId: AreaId;
  solvedChallengeIds: string[];
  onStartMission: (challenge: SPLDVChallenge) => void;
  onClose: () => void;
}

export const NPCDialogueModal: React.FC<NPCDialogueModalProps> = ({
  areaId,
  solvedChallengeIds,
  onStartMission,
  onClose,
}) => {
  const area = AREAS_INFO[areaId];
  const areaChallenges = MISSIONS_DATA.filter((m) => m.areaId === areaId);

  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(
    // Default to first unsolved challenge in this area, or challenge 1
    areaChallenges.find((c) => !solvedChallengeIds.includes(c.id))?.id || areaChallenges[0].id
  );

  const selectedChallenge = areaChallenges.find((c) => c.id === selectedChallengeId) || areaChallenges[0];
  const completedCount = areaChallenges.filter((c) => solvedChallengeIds.includes(c.id)).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-4 bg-gradient-to-r ${area.colorTheme} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-black/30 flex items-center justify-center text-3xl shadow">
              {area.badgeIcon}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
                {area.npcRole} • {area.name}
              </div>
              <h2 className="text-xl font-bold font-['Fredoka']">{area.npcName}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* NPC Greeting Dialogue Bubble */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-start gap-3">
          <div className="text-2xl pt-1">💬</div>
          <div className="flex-1">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              "{area.npcGreeting}"
            </p>
            <div className="mt-2 text-xs text-amber-400 font-semibold flex items-center gap-1.5">
              <span>Progres Area:</span>
              <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-white">
                {completedCount} / 5 Kasus Selesai
              </span>
            </div>
          </div>
        </div>

        {/* Content: List of 5 Challenges */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Daftar Misi Investigasi SPLDV di Area Ini:
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {areaChallenges.map((challenge, idx) => {
              const isSolved = solvedChallengeIds.includes(challenge.id);
              const isSelected = challenge.id === selectedChallengeId;

              return (
                <div
                  key={challenge.id}
                  onClick={() => {
                    setSelectedChallengeId(challenge.id);
                    soundManager.playClick();
                  }}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                        isSolved
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isSolved ? '✓' : idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-['Fredoka']">
                          {challenge.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            challenge.difficulty === 'Mudah'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : challenge.difficulty === 'Sedang'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-purple-950 text-purple-400 border border-purple-800'
                          }`}
                        >
                          {challenge.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {challenge.clue1Text} & {challenge.clue2Text}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isSolved && (
                      <span className="hidden sm:inline-flex text-xs text-emerald-400 font-bold items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Terpecahkan
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 hidden sm:block">
            Pecahkan ke-5 kasus untuk membuka Lencana <strong>{area.badgeName}</strong>!
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition"
            >
              Nanti Saja
            </button>
            <button
              type="button"
              onClick={() => {
                onStartMission(selectedChallenge);
                soundManager.playClick();
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-lg transition flex items-center gap-2 cursor-pointer font-['Fredoka']"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              Mulai Selidiki Kasus Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
