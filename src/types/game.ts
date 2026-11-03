export type AreaId = 'supermarket' | 'restaurant' | 'transport' | 'amusement' | 'headquarters';

export interface MethodStep {
  title: string;
  explanation: string;
  mathFormula?: string;
}

export interface SPLDVChallenge {
  id: string;
  areaId: AreaId;
  challengeNumber: number; // 1 to 5
  title: string;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan';
  contextStory: string;
  itemXName: string;
  itemYName: string;
  itemXUnit: string;
  itemYUnit: string;
  correctX: number;
  correctY: number;
  
  // Clues presented by NPC
  clue1Text: string; // e.g. "2 roti dan 1 susu berharga Rp16.000"
  clue2Text: string; // e.g. "1 roti dan 2 susu berharga Rp14.000"
  
  // Coefficients: a1*x + b1*y = c1; a2*x + b2*y = c2
  eq1: { a: number; b: number; c: number };
  eq2: { a: number; b: number; c: number };

  // Educational hints
  hints: string[];
  
  // Detailed explanation steps for Elimination, Substitution, and Graphic
  eliminationSteps: MethodStep[];
  substitutionSteps: MethodStep[];
  graphicExplanation: string;
}

export interface AreaInfo {
  id: AreaId;
  name: string;
  title: string;
  description: string;
  npcName: string;
  npcRole: string;
  npcGreeting: string;
  colorTheme: string;
  badgeName: string;
  badgeDescription: string;
  badgeIcon: string;
  mapCoords: { x: number; z: number };
  buildingColor: number;
  roofColor: number;
}

export interface PlayerStats {
  playerName: string;
  coins: number;
  xp: number;
  level: number;
  solvedChallengeIds: string[];
  completedAreas: AreaId[];
  starsTotal: number;
  attemptsCount: Record<string, number>;
  timePlayedSeconds: number;
  collectedCoinIds: number[];
  badges: string[];
}

export interface GameSettings {
  bgmVolume: number; // 0 to 1
  sfxVolume: number; // 0 to 1
  mouseSensitivity: number; // 0.5 to 2.0
  cameraInverted: boolean;
  showMinimap: boolean;
}
