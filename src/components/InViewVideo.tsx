"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ExpandIcon, PlayIcon, SoundIcon } from "./icons";

type Props = {
  src: string;
  poster?: string;
  label: string;
  className?: string;
  /** Where the sound / full-screen buttons sit; "side" keeps burned-in titles readable */
  controls?: "corner" | "side";
};

const REDUCE = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb: () => void) => {
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

// Muted, looping, plays only while on screen. Tap to hear it, or open it full
// screen. With reduced motion it waits for a tap. The parent sets the size, so
// nothing moves when the video loads.
export default function InViewVideo({ src, poster, label, className = "", controls = "corner" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => false);
  const userPaused = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.45) {
          if (!reduce && !userPaused.current) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      },
      { threshold: [0, 0.45, 0.8] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src, reduce]);

  function toggleSound() {
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    }
  }

  function onTap() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      toggleSound();
    }
  }

  function fullscreen() {
    const v = ref.current as FullscreenVideo | null;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    v.play().catch(() => {});
    if (v.requestFullscreen) v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.();
  }

  return (
    <div className={`group/video absolute inset-0 ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster || undefined}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        onClick={onTap}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        className="absolute inset-0 size-full cursor-pointer bg-ink object-cover"
      />

      {!playing && reduce && (
        <button
          type="button"
          onClick={onTap}
          aria-label={`Luaj videon: ${label}`}
          className="absolute inset-0 m-auto grid size-16 place-items-center rounded-full bg-paper/90 text-ink shadow-lg"
        >
          <PlayIcon className="ml-1 size-6" />
        </button>
      )}

      <div className={`absolute flex gap-2 ${controls === "side" ? "top-1/2 right-2 -translate-y-1/2 flex-col" : "top-3 right-3"}`}>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Aktivizo zërin" : "Hiq zërin"}
          aria-pressed={!muted}
          className="grid size-10 place-items-center rounded-full bg-ink/60 text-paper backdrop-blur-sm transition-colors hover:bg-ink/80"
        >
          <SoundIcon muted={muted} className="size-[1.15rem]" />
        </button>
        <button
          type="button"
          onClick={fullscreen}
          aria-label="Shiheni në ekran të plotë"
          className="grid size-10 place-items-center rounded-full bg-ink/60 text-paper backdrop-blur-sm transition-colors hover:bg-ink/80"
        >
          <ExpandIcon className="size-[1.05rem]" />
        </button>
      </div>
    </div>
  );
}
