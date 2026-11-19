import { useEffect, useRef, useState } from "react";

export function useRevealSequence() {
  const [sequence, setSequence] = useState(null);
  const audioRef = useRef(null);
  const startedRef = useRef(false);
  const frameRef = useRef(null);

  function startReveal(_clickedArtist, featuredArtists) {
    if (startedRef.current) return;

    const artists = ["The Illusionz", "0nce0nFire"].map((name) =>
      featuredArtists.find((artist) => artist.artist_name.trim() === name),
    );

    if (artists.some((artist) => !artist)) return;

    startedRef.current = true;

    const audio = new Audio("/audio/pulse-master.m4a");
    audio.preload = "auto";
    audioRef.current = audio;

    setSequence({ artists, stage: "intro", artistIndex: 0 });

    function tick() {
      const time = audio.currentTime;
      const stage =
        time < 1.2 ? "intro" : time < 31.2 ? "artist" : "escape";
      const artistIndex = time < 16.2 ? 0 : 1;

      setSequence((current) => {
        if (!current) return current;
        if (
          current.stage === stage &&
          current.artistIndex === artistIndex
        ) {
          return current;
        }

        return { ...current, stage, artistIndex };
      });

      if (!audio.ended) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    audio.onended = () => {
      cancelAnimationFrame(frameRef.current);
      setSequence({ artists, stage: "complete", artistIndex: 1 });
    };

    audio.play().then(tick).catch((error) => {
      console.error("PULSE audio could not play:", error);
      startedRef.current = false;
      setSequence(null);
    });
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(frameRef.current);

      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }
    };
  }, []);

  return { sequence, startReveal, audioRef };
}