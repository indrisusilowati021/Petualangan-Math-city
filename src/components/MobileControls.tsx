import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from 'lucide-react';
import { CityWorld } from '../game3d/CityWorld';

interface MobileControlsProps {
  worldRef: React.RefObject<CityWorld | null>;
}

export const MobileControls: React.FC<MobileControlsProps> = ({ worldRef }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect if touch is supported
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(hasTouch);
  }, []);

  if (!isTouchDevice) {
    return null; // On purely non-touch desktops, keep screen 100% clean
  }

  const toggleRun = () => {
    const next = !isRunning;
    setIsRunning(next);
    if (worldRef.current) {
      worldRef.current.isRunning = next;
    }
  };

  const handleJump = () => {
    if (worldRef.current && worldRef.current.isGrounded) {
      worldRef.current.requestJump = true;
    }
  };

  const handleInteract = () => {
    if (worldRef.current) {
      worldRef.current.triggerInteractKey();
    }
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-between px-4 sm:px-8 select-none">
      {/* Virtual D-pad (Left side) */}
      <div className="pointer-events-auto grid grid-cols-3 gap-1.5 w-36 h-36 bg-slate-900/60 p-2 rounded-2xl backdrop-blur-sm border border-slate-700/60">
        <div />
        <button
          type="button"
          onTouchStart={() => { if (worldRef.current) worldRef.current.moveForward = true; }}
          onTouchEnd={() => { if (worldRef.current) worldRef.current.moveForward = false; }}
          onMouseDown={() => { if (worldRef.current) worldRef.current.moveForward = true; }}
          onMouseUp={() => { if (worldRef.current) worldRef.current.moveForward = false; }}
          className="bg-slate-800/80 active:bg-amber-500 rounded-xl flex items-center justify-center text-white"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
        <div />

        <button
          type="button"
          onTouchStart={() => { if (worldRef.current) worldRef.current.moveLeft = true; }}
          onTouchEnd={() => { if (worldRef.current) worldRef.current.moveLeft = false; }}
          onMouseDown={() => { if (worldRef.current) worldRef.current.moveLeft = true; }}
          onMouseUp={() => { if (worldRef.current) worldRef.current.moveLeft = false; }}
          className="bg-slate-800/80 active:bg-amber-500 rounded-xl flex items-center justify-center text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center justify-center text-[10px] font-bold text-slate-500">
          PAD
        </div>
        <button
          type="button"
          onTouchStart={() => { if (worldRef.current) worldRef.current.moveRight = true; }}
          onTouchEnd={() => { if (worldRef.current) worldRef.current.moveRight = false; }}
          onMouseDown={() => { if (worldRef.current) worldRef.current.moveRight = true; }}
          onMouseUp={() => { if (worldRef.current) worldRef.current.moveRight = false; }}
          className="bg-slate-800/80 active:bg-amber-500 rounded-xl flex items-center justify-center text-white"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        <div />
        <button
          type="button"
          onTouchStart={() => { if (worldRef.current) worldRef.current.moveBackward = true; }}
          onTouchEnd={() => { if (worldRef.current) worldRef.current.moveBackward = false; }}
          onMouseDown={() => { if (worldRef.current) worldRef.current.moveBackward = true; }}
          onMouseUp={() => { if (worldRef.current) worldRef.current.moveBackward = false; }}
          className="bg-slate-800/80 active:bg-amber-500 rounded-xl flex items-center justify-center text-white"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
        <div />
      </div>

      {/* Action buttons (Right side) */}
      <div className="pointer-events-auto flex flex-col items-end gap-2.5">
        {/* Sprint toggle button */}
        <button
          type="button"
          onClick={toggleRun}
          className={`w-12 h-12 rounded-full border-2 font-bold text-xs flex items-center justify-center shadow-lg transition ${
            isRunning
              ? 'bg-amber-500 border-amber-300 text-slate-950 scale-105'
              : 'bg-slate-900/80 border-slate-700 text-slate-300'
          }`}
        >
          <Zap className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          {/* Action [E] Interact button */}
          <button
            type="button"
            onClick={handleInteract}
            className="w-14 h-14 rounded-2xl bg-cyan-600 active:bg-cyan-500 border-2 border-cyan-400 font-bold text-white text-base shadow-xl flex items-center justify-center"
          >
            [E]
          </button>

          {/* Jump [Space] button */}
          <button
            type="button"
            onClick={handleJump}
            className="w-16 h-16 rounded-2xl bg-amber-500 active:bg-amber-400 border-2 border-amber-300 font-bold text-slate-950 text-base shadow-xl flex items-center justify-center font-['Fredoka']"
          >
            LOMPAT
          </button>
        </div>
      </div>
    </div>
  );
};
