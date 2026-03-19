"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function parseTracks(): string[] {
  const raw = process.env.NEXT_PUBLIC_GALLERY_AUDIO_TRACKS?.trim();
  if (raw) {
    const list = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (list.length > 0) return list;
  }
  return ["/audio/family-1.mp3", "/audio/family-2.mp3"];
}

export default function GalleryMusicPlayer() {
  const tracks = parseTracks();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userPausedRef = useRef(false);

  const src = tracks[index] ?? tracks[0];

  const tryPlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    userPausedRef.current = false;
    void el
      .play()
      .then(() => {
        setPlaying(true);
        setBlocked(false);
      })
      .catch(() => {
        setPlaying(false);
        setBlocked(true);
      });
  }, []);

  const pause = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    userPausedRef.current = true;
    el.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) pause();
    else tryPlay();
  }, [pause, playing, tryPlay]);

  // After login, LoginForm sets this so we can nudge if autoplay is blocked.
  const [welcomeHint, setWelcomeHint] = useState(false);
  useEffect(() => {
    try {
      if (sessionStorage.getItem("family_memories_welcome_music") === "1") {
        sessionStorage.removeItem("family_memories_welcome_music");
        setWelcomeHint(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (playing) setWelcomeHint(false);
  }, [playing]);

  // Autoplay when entering gallery or when advancing to the next track (if user didn’t pause).
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !src) return;

    el.load();

    if (userPausedRef.current) {
      setPlaying(false);
      return;
    }

    void el
      .play()
      .then(() => {
        setPlaying(true);
        setBlocked(false);
      })
      .catch(() => {
        setPlaying(false);
        setBlocked(true);
      });
  }, [src]);

  function handleEnded() {
    if (userPausedRef.current) return;
    if (tracks.length <= 1) {
      const el = audioRef.current;
      if (!el) return;
      el.currentTime = 0;
      tryPlay();
      return;
    }
    setIndex((i) => (i + 1) % tracks.length);
  }

  function handleError() {
    if (tracks.length > 1) {
      setIndex((i) => (i + 1) % tracks.length);
      return;
    }
    setLoadError(true);
    setPlaying(false);
  }

  if (loadError) {
    return (
      <div
        className="fixed bottom-4 right-4 z-[100] max-w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-amber-500/25 bg-midnight-950/90 px-3 py-2 text-xs text-amber-200/90 shadow-lg backdrop-blur-md"
        role="status"
      >
        Couldn&apos;t load audio. Add MP3s to{" "}
        <code className="rounded bg-midnight-800 px-1">public/audio/</code> or
        set{" "}
        <code className="rounded bg-midnight-800 px-1">
          NEXT_PUBLIC_GALLERY_AUDIO_TRACKS
        </code>
        .
      </div>
    );
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        onEnded={handleEnded}
        onError={handleError}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="hidden"
        aria-hidden
      />
      <div
        className="fixed bottom-4 right-4 z-[100] flex flex-col items-end gap-2"
        data-gallery-music
      >
        {(blocked || welcomeHint) && (
          <p className="max-w-[14rem] rounded-lg border border-champagne-400/20 bg-midnight-950/85 px-3 py-2 text-center text-[11px] leading-snug text-mist-300 shadow-lg backdrop-blur-md">
            {welcomeHint
              ? "Welcome! If you don’t hear music, tap Play below (your browser may require it)."
              : "Tap play to hear the gallery soundtrack."}
          </p>
        )}
        <div className="rounded-xl border border-champagne-400/20 bg-midnight-950/80 p-2 shadow-lg backdrop-blur-md">
          <button
            type="button"
            onClick={toggle}
            className="flex h-10 min-w-[5.5rem] items-center justify-center gap-2 rounded-lg border border-champagne-400/25 bg-regal-600/90 px-3 text-sm font-semibold text-midnight-950 transition hover:bg-regal-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-regal-400"
            aria-pressed={playing}
            aria-label={playing ? "Pause gallery music" : "Play gallery music"}
          >
            <span className="text-base" aria-hidden>
              {playing ? "❚❚" : "▶"}
            </span>
            {playing ? "Pause" : "Play"}
          </button>
        </div>
      </div>
    </>
  );
}
