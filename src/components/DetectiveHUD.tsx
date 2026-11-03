import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  Coins, 
  Compass, 
  MapPin, 
  Menu, 
  Navigation, 
  Settings as SettingsIcon, 
  Sparkles, 
  Star, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { AreaId, PlayerStats } from '../types/game';
import { AREAS_INFO } from '../data/missionsData';
import { soundManager } from '../audio/soundManager';

interface DetectiveHUDProps {
  stats: PlayerStats;
  nearAreaId: AreaId | null;
  playerPosition: { x: number; z: number; heading: number };
  onOpenNotebook: () => void;
  onOpenSettings: () => void;
  onInteract: () => void;
  onTeleport: (areaId: AreaId) => void;
  isBgmOn: boolean;
  onToggleBgm: () => void;
}

export const DetectiveHUD: React.FC<DetectiveHUDProps> = ({
  stats,
  nearAreaId,
  playerPosition,
  onOpenNotebook,
  onOpenSettings,
  onInteract,
  onTeleport,
  isBgmOn,
  onToggleBgm,
}) => {
  const [showFastTravel, setShowFastTravel] = useState(false);
  const [showMinimap, setShowMinimap] = useState(true);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);

  // Level title helper
  const getLevelTitle = (lvl: number) => {
    if (lvl >= 5) return 'Detektif Legendaris Math City';
    if (lvl === 4) return 'Master Eliminasi SPLDV';
    if (lvl === 3) return 'Analis Aljabar Linear';
    if (lvl === 2) return 'Detektif Lapangan';
    return 'Detektif Pemula';
  };

  const xpForNextLevel = stats.level * 300;
  const currentLevelXP = stats.xp % 300;
  const xpProgress = Math.min(100, Math.floor((currentLevelXP / 300) * 100));

  const nearArea = nearAreaId ? AREAS_INFO[nearAreaId] : null;

  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-5 select-none font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* --- TOP STATUS BAR --- */}
      <div className="flex items-start justify-between gap-3 w-full">
        {/* Left: Player Profile & Level */}
        <div className="pointer-events-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 shadow-xl backdrop-blur-sm flex items-center gap-3 max-w-sm">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-slate-950 text-xl font-['Fredoka'] shadow">
            🕵️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white font-['Fredoka']">
                {stats.playerName}
              </span>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                Lv. {stats.level}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {getLevelTitle(stats.level)}
            </div>

            {/* XP bar */}
            <div className="w-36 sm:w-44 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-700">
              <div
                className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Currency & Badges Bar */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-2 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-sm">
            <Coins className="w-4 h-4 fill-amber-400" />
            <span>{stats.coins.toLocaleString('id-ID')}</span>
          </div>
          <div className="w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-1.5 text-yellow-300 font-bold text-sm">
            <Star className="w-4 h-4 fill-yellow-400" />
            <span>{stats.starsTotal}</span>
          </div>
          <div className="w-px h-4 bg-slate-700" />
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm">
            <Award className="w-4 h-4" />
            <span>{stats.solvedChallengeIds.length}/25 Kasus</span>
          </div>
        </div>

        {/* Right: Radar Minimap & Utility buttons */}
        <div className="flex flex-col items-end gap-2">
          {/* Minimap Radar */}
          {showMinimap && (
            <div className="pointer-events-auto relative w-28 h-28 sm:w-32 sm:h-32 bg-slate-950/90 border-2 border-slate-700 rounded-full shadow-2xl overflow-hidden backdrop-blur-md flex items-center justify-center">
              {/* Compass Ring */}
              <div className="absolute inset-1 border border-slate-800/80 rounded-full pointer-events-none" />
              <div className="absolute inset-4 border border-slate-800/60 rounded-full pointer-events-none" />
              <div className="absolute top-1 text-[8px] font-bold text-slate-400">U</div>
              <div className="absolute bottom-1 text-[8px] font-bold text-slate-500">S</div>
              <div className="absolute left-1 text-[8px] font-bold text-slate-500">B</div>
              <div className="absolute right-1 text-[8px] font-bold text-slate-500">T</div>

              {/* Center Crosshairs */}
              <div className="absolute w-full h-px bg-slate-800/50" />
              <div className="absolute h-full w-px bg-slate-800/50" />

              {/* 5 Area Pins on Minimap (World bounds approx -50 to 50 maps to minimap radius) */}
              {Object.values(AREAS_INFO).map((area) => {
                const normX = (area.mapCoords.x / 60) * 44;
                const normZ = (area.mapCoords.z / 60) * 44;
                return (
                  <button
                    key={area.id}
                    type="button"
                    title={area.name}
                    onClick={() => onTeleport(area.id)}
                    className="absolute w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition"
                    style={{
                      left: `calc(50% + ${normX}px)`,
                      top: `calc(50% + ${normZ}px)`,
                      backgroundColor: `#${area.buildingColor.toString(16)}`,
                    }}
                  >
                    {area.badgeIcon}
                  </button>
                );
              })}

              {/* Player dot with heading pointer */}
              <div
                className="absolute w-3 h-3 bg-white rounded-full border-2 border-rose-500 shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                style={{
                  left: `calc(50% + ${(playerPosition.x / 60) * 44}px)`,
                  top: `calc(50% + ${(playerPosition.z / 60) * 44}px)`,
                }}
              >
                <div
                  className="w-1.5 h-2 bg-rose-500 mx-auto -mt-1 rounded-sm"
                  style={{
                    transform: `rotate(${playerPosition.heading}rad)`,
                    transformOrigin: 'center bottom',
                  }}
                />
              </div>
            </div>
          )}

          {/* Quick HUD Action Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowMinimap(!showMinimap)}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white shadow hover:bg-slate-800 transition"
              title="Toggle Peta Mini"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowFastTravel(!showFastTravel)}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white shadow hover:bg-slate-800 transition"
              title="Teleportasi Cepat"
            >
              <Navigation className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onOpenNotebook}
              className="p-2 rounded-xl bg-amber-500/90 text-slate-950 font-bold shadow hover:bg-amber-400 transition flex items-center gap-1"
              title="Buku Catatan Kasus Detektif"
            >
              <BookOpen className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">Buku Kasus</span>
            </button>
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white shadow hover:bg-slate-800 transition"
              title="Pengaturan"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Fast-travel Dropdown menu */}
          {showFastTravel && (
            <div className="pointer-events-auto bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-2xl flex flex-col gap-1 w-48 animate-fadeIn">
              <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                Teleportasi Detektif:
              </div>
              {Object.values(AREAS_INFO).map((area) => (
                <button
                  key={area.id}
                  onClick={() => {
                    onTeleport(area.id);
                    setShowFastTravel(false);
                  }}
                  className="px-2.5 py-1.5 text-left text-xs rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2 transition"
                >
                  <span>{area.badgeIcon}</span>
                  <span className="truncate">{area.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- FLOATING NPC PROXIMITY INTERACT PROMPT --- */}
      {nearArea && (
        <div className="self-center mb-4 pointer-events-auto animate-bounce">
          <button
            type="button"
            onClick={onInteract}
            className={`px-6 py-3 rounded-2xl bg-gradient-to-r ${nearArea.colorTheme} text-white font-bold text-sm sm:text-base shadow-2xl flex items-center gap-3 border-2 border-white/40 cursor-pointer font-['Fredoka'] hover:scale-105 transition transform`}
          >
            <span className="text-xl">{nearArea.badgeIcon}</span>
            <span>[E] Bicara dengan {nearArea.npcName}</span>
          </button>
        </div>
      )}

      {/* --- BOTTOM ERGONOMIC CONTROL DOCK (Three.js Directive Compliant) --- */}
      <div className="self-center pointer-events-auto flex flex-col items-center">
        {/* Toggle Collapse/Expand Dock */}
        <button
          type="button"
          onClick={() => setIsDockCollapsed(!isDockCollapsed)}
          className="mb-1 text-[11px] font-bold bg-slate-900/80 border border-slate-700/80 text-slate-400 hover:text-white px-3 py-0.5 rounded-full flex items-center gap-1 shadow backdrop-blur-sm transition"
        >
          {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {isDockCollapsed ? 'Tampilkan Kontrol' : 'Sembunyikan Kontrol'}
        </button>

        {!isDockCollapsed && (
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl px-4 py-2.5 shadow-2xl backdrop-blur-sm flex items-center gap-2 sm:gap-4 max-w-[94vw] text-xs">
            {/* Quick controls info */}
            <div className="hidden lg:flex items-center gap-3 text-slate-400 text-[11px]">
              <span><kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-slate-700 font-mono">WASD</kbd> Gerak</span>
              <span><kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-slate-700 font-mono">SPACE</kbd> Lompat</span>
              <span><kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-slate-700 font-mono">SHIFT</kbd> Lari</span>
              <span><kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-slate-700 font-mono">E</kbd> Interaksi</span>
              <span><kbd className="bg-slate-800 text-slate-200 px-1.5 py-0.5 rounded border border-slate-700 font-mono">Mouse</kbd> Kamera</span>
            </div>

            <div className="hidden lg:block w-px h-5 bg-slate-800" />

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={onToggleBgm}
              className={`p-2 rounded-xl transition flex items-center gap-1.5 font-medium ${
                isBgmOn ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
              }`}
              title="Musik BGM"
            >
              {isBgmOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isBgmOn ? 'BGM Nyala' : 'BGM Mati'}</span>
            </button>

            {/* Quick Teleport to Headquarters / Nearest */}
            <button
              type="button"
              onClick={() => onTeleport('headquarters')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition flex items-center gap-1.5"
            >
              <span>🏆</span>
              <span>Markas Detektif</span>
            </button>

            {/* Mobile View stats indicator */}
            <div className="flex md:hidden items-center gap-2 text-amber-400 font-bold">
              <Coins className="w-3.5 h-3.5" />
              <span>{stats.coins}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
