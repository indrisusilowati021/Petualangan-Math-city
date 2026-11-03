import React, { useEffect, useRef, useState } from 'react';
import { CityWorld } from './game3d/CityWorld';
import { AreaId, GameSettings, PlayerStats, SPLDVChallenge } from './types/game';
import { AREAS_INFO, MISSIONS_DATA } from './data/missionsData';
import { soundManager } from './audio/soundManager';
import { HomeScreen } from './components/HomeScreen';
import { DetectiveHUD } from './components/DetectiveHUD';
import { MobileControls } from './components/MobileControls';
import { NPCDialogueModal } from './components/NPCDialogueModal';
import { SPLDVMissionModal } from './components/SPLDVMissionModal';
import { DetectiveNotebookModal } from './components/DetectiveNotebookModal';
import { SettingsModal } from './components/SettingsModal';
import { VictoryEvaluationModal } from './components/VictoryEvaluationModal';

const INITIAL_STATS: PlayerStats = {
  playerName: 'Detektif Cilik',
  coins: 0,
  xp: 0,
  level: 1,
  solvedChallengeIds: [],
  completedAreas: [],
  starsTotal: 0,
  attemptsCount: {},
  timePlayedSeconds: 0,
  collectedCoinIds: [],
  badges: [],
};

const INITIAL_SETTINGS: GameSettings = {
  bgmVolume: 0.35,
  sfxVolume: 0.5,
  mouseSensitivity: 1.0,
  cameraInverted: false,
  showMinimap: true,
};

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<CityWorld | null>(null);

  // Game UI State
  const [gameState, setGameState] = useState<'home' | 'playing'>('home');
  const [isBgmOn, setIsBgmOn] = useState<boolean>(true);
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem('math_city_stats_v1');
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('math_city_settings_v1');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Active Modals
  const [nearAreaId, setNearAreaId] = useState<AreaId | null>(null);
  const [activeNPCModalArea, setActiveNPCModalArea] = useState<AreaId | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<SPLDVChallenge | null>(null);
  const [showNotebook, setShowNotebook] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showVictory, setShowVictory] = useState<boolean>(false);

  // Player position for HUD minimap
  const [playerPosition, setPlayerPosition] = useState<{ x: number; z: number; heading: number }>({
    x: 0,
    z: 10,
    heading: 0,
  });

  // Save stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('math_city_stats_v1', JSON.stringify(stats));
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [stats]);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem('math_city_settings_v1', JSON.stringify(settings));
    } catch {
      // Ignore
    }
  }, [settings]);

  // Playtime Timer
  useEffect(() => {
    if (gameState !== 'playing') return;
    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        timePlayedSeconds: prev.timePlayedSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState]);

  // Initialize 3D City World
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const world = new CityWorld(canvasMountRef.current, {
      onNearNPC: (areaId) => {
        setNearAreaId(areaId);
      },
      onCoinCollected: (coinId, totalCollected) => {
        setStats((prev) => ({
          ...prev,
          coins: prev.coins + 25,
          xp: prev.xp + 15,
          collectedCoinIds: [...prev.collectedCoinIds, coinId],
        }));
      },
      onPlayerPositionUpdate: (pos) => {
        setPlayerPosition(pos);
      },
    });

    worldRef.current = world;

    return () => {
      world.dispose();
      worldRef.current = null;
    };
  }, []);

  // Handlers
  const handleStartGame = (name: string) => {
    setStats((prev) => ({ ...prev, playerName: name }));
    setGameState('playing');
    if (isBgmOn) {
      soundManager.startBGM();
    }
  };

  const handleToggleBgm = () => {
    const next = !isBgmOn;
    setIsBgmOn(next);
    if (next) {
      soundManager.startBGM();
    } else {
      soundManager.stopBGM();
    }
  };

  const handleInteract = () => {
    if (nearAreaId) {
      setActiveNPCModalArea(nearAreaId);
      soundManager.playInteract();
    }
  };

  const handleTeleport = (areaId: AreaId) => {
    if (worldRef.current) {
      worldRef.current.teleportToArea(areaId);
    }
  };

  const handleStartMission = (challenge: SPLDVChallenge) => {
    setActiveNPCModalArea(null);
    setActiveChallenge(challenge);
  };

  const handleSolveSuccess = (challengeId: string, earnedCoins: number, earnedXP: number, earnedStars: number) => {
    setStats((prev) => {
      const isAlreadySolved = prev.solvedChallengeIds.includes(challengeId);
      const newSolvedIds = isAlreadySolved ? prev.solvedChallengeIds : [...prev.solvedChallengeIds, challengeId];
      const newCoins = prev.coins + earnedCoins;
      const newXP = prev.xp + earnedXP;
      const newStars = prev.starsTotal + earnedStars;

      // Calculate level (1 level every 300 XP, max lv 5)
      const newLevel = Math.min(5, 1 + Math.floor(newXP / 300));

      // Check if area is fully completed
      const currentAreaId = activeChallenge?.areaId;
      let newCompletedAreas = [...prev.completedAreas];
      if (currentAreaId) {
        const areaMissions = MISSIONS_DATA.filter((m) => m.areaId === currentAreaId);
        const allDone = areaMissions.every((m) => newSolvedIds.includes(m.id));
        if (allDone && !newCompletedAreas.includes(currentAreaId)) {
          newCompletedAreas.push(currentAreaId);
        }
      }

      // Check for grand victory: if 5th mission of headquarters is solved or 20+ cases solved
      if (challengeId === 'hq-5' || newSolvedIds.length >= 25) {
        setTimeout(() => {
          setShowVictory(true);
        }, 1200);
      }

      return {
        ...prev,
        solvedChallengeIds: newSolvedIds,
        coins: newCoins,
        xp: newXP,
        starsTotal: newStars,
        level: newLevel,
        completedAreas: newCompletedAreas,
      };
    });
  };

  const handleNextChallenge = () => {
    if (!activeChallenge) return;
    const currentIdx = MISSIONS_DATA.findIndex((m) => m.id === activeChallenge.id);
    if (currentIdx !== -1 && currentIdx < MISSIONS_DATA.length - 1) {
      setActiveChallenge(MISSIONS_DATA[currentIdx + 1]);
    } else {
      setActiveChallenge(null);
    }
  };

  const handleResetProgress = () => {
    setStats(INITIAL_STATS);
    try {
      localStorage.removeItem('math_city_stats_v1');
    } catch {
      // Ignore
    }
    soundManager.playClick();
  };

  const currentChallengeIndex = activeChallenge ? MISSIONS_DATA.findIndex((m) => m.id === activeChallenge.id) : -1;
  const hasNextChallenge = currentChallengeIndex !== -1 && currentChallengeIndex < MISSIONS_DATA.length - 1;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-900 select-none">
      {/* 3D WebGL Canvas Mount (Isolated Ref Container) */}
      <div ref={canvasMountRef} className="absolute inset-0 w-full h-full block cursor-grab active:cursor-grabbing" />

      {/* HOME SCREEN OVERLAY */}
      {gameState === 'home' && (
        <HomeScreen
          defaultPlayerName={stats.playerName}
          onStartGame={handleStartGame}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* IN-GAME HUD & TOUCH CONTROLS */}
      {gameState === 'playing' && (
        <>
          <DetectiveHUD
            stats={stats}
            nearAreaId={nearAreaId}
            playerPosition={playerPosition}
            onOpenNotebook={() => setShowNotebook(true)}
            onOpenSettings={() => setShowSettings(true)}
            onInteract={handleInteract}
            onTeleport={handleTeleport}
            isBgmOn={isBgmOn}
            onToggleBgm={handleToggleBgm}
          />

          <MobileControls worldRef={worldRef} />
        </>
      )}

      {/* NPC DIALOGUE & MISSION SELECTOR MODAL */}
      {activeNPCModalArea && (
        <NPCDialogueModal
          areaId={activeNPCModalArea}
          solvedChallengeIds={stats.solvedChallengeIds}
          onStartMission={handleStartMission}
          onClose={() => setActiveNPCModalArea(null)}
        />
      )}

      {/* SPLDV MISSION WORKBENCH MODAL */}
      {activeChallenge && (
        <SPLDVMissionModal
          challenge={activeChallenge}
          isSolvedAlready={stats.solvedChallengeIds.includes(activeChallenge.id)}
          onClose={() => setActiveChallenge(null)}
          onSolveSuccess={handleSolveSuccess}
          onNextChallenge={handleNextChallenge}
          hasNextChallenge={hasNextChallenge}
        />
      )}

      {/* DETECTIVE NOTEBOOK DOSSIER */}
      {showNotebook && (
        <DetectiveNotebookModal
          stats={stats}
          onClose={() => setShowNotebook(false)}
          onTeleport={handleTeleport}
        />
      )}

      {/* SETTINGS MODAL */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* VICTORY GRAND EVALUATION MODAL */}
      {showVictory && (
        <VictoryEvaluationModal
          stats={stats}
          onClose={() => setShowVictory(false)}
          onRestart={() => {
            handleResetProgress();
            setShowVictory(false);
            setGameState('home');
          }}
        />
      )}
    </div>
  );
}
