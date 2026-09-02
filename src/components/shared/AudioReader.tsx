"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2, VolumeX, Play, Pause, Square,
  ChevronLeft, ChevronRight, X, Mic2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Selectors to read; excludes code, nav, buttons
const READ_SELECTORS = "h1, h2, h3, h4, p, li";
const EXCLUDE_PARENTS = ["code", "pre", "button", "nav", "script", "[data-no-read]", ".no-read"];
const SPEEDS = [0.75, 1, 1.25, 1.5, 2];
const SPEED_LABELS = ["0.75×", "1×", "1.25×", "1.5×", "2×"];

function extractPageText(): string[] {
  const elements = document.querySelectorAll<HTMLElement>(READ_SELECTORS);
  const out: string[] = [];
  elements.forEach((el) => {
    // Skip if inside excluded containers
    for (const sel of EXCLUDE_PARENTS) {
      if (el.closest(sel)) return;
    }
    const text = el.innerText?.trim();
    if (text && text.length > 20 && !text.startsWith("//") && !text.startsWith("{")) {
      out.push(text);
    }
  });
  return out;
}

export function AudioReader() {
  const [supported, setSupported] = useState(false);
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [segments, setSegments] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(1); // default 1×

  // Refs to avoid stale closures in utterance callbacks
  const isPlayingRef = useRef(false);
  const idxRef = useRef(0);
  const segRef = useRef<string[]>([]);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const speedRef = useRef(1);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
    }
  }, []);

  // Load voices (Chrome fires onvoiceschanged; others load synchronously)
  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const all = window.speechSynthesis.getVoices();
      // Prefer English voices
      const en = all.filter((v) => v.lang.startsWith("en"));
      setVoices(en.length ? en : all);
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [supported]);

  // Keep refs in sync
  useEffect(() => { voiceRef.current = voices[voiceIdx] ?? null; }, [voices, voiceIdx]);
  useEffect(() => { speedRef.current = SPEEDS[speedIdx]; }, [speedIdx]);

  // Stop on unmount
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);

  function speak(atIdx: number) {
    const segs = segRef.current;
    if (atIdx >= segs.length) {
      isPlayingRef.current = false;
      setPlaying(false);
      setIdx(0);
      idxRef.current = 0;
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(segs[atIdx]);
    if (voiceRef.current) utt.voice = voiceRef.current;
    utt.rate = speedRef.current;
    utt.pitch = 1;

    utt.onend = () => {
      if (!isPlayingRef.current) return;
      const next = atIdx + 1;
      idxRef.current = next;
      setIdx(next);
      speak(next);
    };
    utt.onerror = () => {
      isPlayingRef.current = false;
      setPlaying(false);
    };
    window.speechSynthesis.speak(utt);
  }

  function handleOpen() {
    const segs = extractPageText();
    segRef.current = segs;
    setSegments(segs);
    idxRef.current = 0;
    setIdx(0);
    setOpen(true);
  }

  function handlePlay() {
    if (playing) {
      // Pause
      window.speechSynthesis.pause();
      isPlayingRef.current = false;
      setPlaying(false);
    } else {
      // Resume or start
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        speak(idxRef.current);
      }
      isPlayingRef.current = true;
      setPlaying(true);
    }
  }

  function handleStop() {
    window.speechSynthesis.cancel();
    isPlayingRef.current = false;
    setPlaying(false);
    setIdx(0);
    idxRef.current = 0;
  }

  function handlePrev() {
    const prev = Math.max(0, idxRef.current - 1);
    window.speechSynthesis.cancel();
    idxRef.current = prev;
    setIdx(prev);
    if (playing) speak(prev);
  }

  function handleNext() {
    const next = Math.min(segRef.current.length - 1, idxRef.current + 1);
    window.speechSynthesis.cancel();
    idxRef.current = next;
    setIdx(next);
    if (playing) speak(next);
  }

  function handleClose() {
    handleStop();
    setOpen(false);
  }

  function handleVoiceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newIdx = Number(e.target.value);
    setVoiceIdx(newIdx);
    voiceRef.current = voices[newIdx] ?? null;
    if (playing) {
      // Restart current segment with new voice
      window.speechSynthesis.cancel();
      speak(idxRef.current);
    }
  }

  const progress = segments.length ? Math.round(((idx + 1) / segments.length) * 100) : 0;
  const currentText = segments[idx] ?? "";

  if (!supported) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-96 rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-[#1F2144] text-white">
              <Mic2 size={15} className="text-[#F47920] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Read Aloud</p>
                <p className="text-xs text-white/80 mt-0.5 truncate">
                  {segments.length
                    ? `${idx + 1} of ${segments.length} sections`
                    : "Extracting page content..."}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-gray-100">
              <motion.div
                className="h-full bg-[#F47920]"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Current text preview */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 min-h-[56px] flex items-center">
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                {currentText || "Press play to start reading."}
              </p>
            </div>

            {/* Controls */}
            <div className="px-4 py-3 flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={idx === 0}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
                title="Previous"
              >
                <ChevronLeft size={14} />
              </button>

              <button
                onClick={handlePlay}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-1 justify-center",
                  playing
                    ? "bg-amber-50 border border-amber-200 text-amber-700"
                    : "bg-[#F47920] text-white hover:bg-[#d96a18] shadow-sm"
                )}
              >
                {playing ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Play</>}
              </button>

              <button
                onClick={handleNext}
                disabled={idx >= segments.length - 1}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-gray-600"
                title="Next"
              >
                <ChevronRight size={14} />
              </button>

              <button
                onClick={handleStop}
                className="p-2 rounded-xl border border-gray-200 hover:bg-red-50 hover:border-red-200 transition-colors text-gray-500 hover:text-red-600"
                title="Stop"
              >
                <Square size={14} />
              </button>
            </div>

            {/* Settings row */}
            <div className="px-4 pb-3 flex items-center gap-3">
              {/* Speed */}
              <div className="flex items-center gap-1 border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                {SPEED_LABELS.map((label, i) => (
                  <button
                    key={label}
                    onClick={() => {
                      setSpeedIdx(i);
                      speedRef.current = SPEEDS[i];
                      if (playing) { window.speechSynthesis.cancel(); speak(idxRef.current); }
                    }}
                    className={cn(
                      "px-2.5 py-1 text-[11px] font-medium transition-colors",
                      speedIdx === i
                        ? "bg-[#1F2144] text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Voice selector */}
              {voices.length > 1 && (
                <select
                  value={voiceIdx}
                  onChange={handleVoiceChange}
                  className="flex-1 text-[11px] border border-gray-200 rounded-xl px-2 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#F47920]/40 truncate"
                >
                  {voices.map((v, i) => (
                    <option key={i} value={i}>
                      {v.name.replace("Microsoft ", "").replace(" Online (Natural)", "")}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating pill button */}
      <motion.button
        onClick={open ? handleClose : handleOpen}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold shadow-lg transition-colors",
          open
            ? "bg-gray-800 text-white"
            : "bg-[#F47920] text-white hover:bg-[#d96a18]"
        )}
      >
        {open
          ? <><VolumeX size={16} /> Close reader</>
          : <><Volume2 size={16} /> Read aloud</>}
      </motion.button>
    </div>
  );
}
