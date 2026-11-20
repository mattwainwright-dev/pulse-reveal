import { useEffect, useRef, useState } from "react";

export function useRevealSequence() {
  const [sequence, setSequence] = useState(null);
  const audioRef = useRef(null);
  const startedRef = useRef(false);
  const frameRef = useRef(null);

  function startReveal(clickedArtist, featuredArtists) {
    if (startedRef.current) return;

    const otherArtist = featuredArtists.find(
      (artist) => artist.id !== clickedArtist.id,
    );

    if (!otherArtist) return;

    const artists = [clickedArtist, otherArtist];
    const onceFirst = clickedArtist.artist_name.trim() === "0nce0nFire";
    const firstStart = onceFirst ? 1.7 : 1.2;
    const firstEnd = firstStart + 15;

    startedRef.current = true;

    const audio = new Audio(
      onceFirst
        ? "/audio/pulse-approved-once.m4a"
        : "/video/PULSE_Two_Added_Lines_Review.mp4",
    );

    audio.preload = "auto";
    audioRef.current = audio;

    setSequence({ artists, stage: "intro", artistIndex: 0 });

    function tick() {
      const time = audio.currentTime;
      const artistIndex = time >= 17.9 ? 1 : 0;
      const stage =
        time >= 32.9
          ? "escape"
          : time < firstStart || (time >= firstEnd && time < 17.9)
            ? "intro"
            : "artist";

      setSequence((current) => {
        if (
          !current ||
          (current.stage === stage && current.artistIndex === artistIndex)
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

    audio
      .play()
      .then(tick)
      .catch((error) => {
        console.error("PULSE audio could not play:", error);
        startedRef.current = false;
        audioRef.current = null;
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
