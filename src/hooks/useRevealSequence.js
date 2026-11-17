import { useEffect, useRef, useState } from "react";

function playArtistAudio(audio, artist) {
  audio.pause();
  audio.src = artist.audio_url;
  audio.currentTime = 0;

  audio.play().catch((error) => {
    console.error("Artist audio could not play:", error);
  });
}

export function useRevealSequence() {
  const [sequence, setSequence] = useState(null);
  const audioRef = useRef(null);
  const startedRef = useRef(false);

  function startReveal(clickedArtist, featuredArtists) {
    if (startedRef.current) return;

    const otherArtist = featuredArtists.find(
      (artist) => artist.id !== clickedArtist.id,
    );

    if (!otherArtist) return;

    startedRef.current = true;

    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    playArtistAudio(audio, clickedArtist);

    setSequence({
      artists: [clickedArtist, otherArtist],
      stage: "artist",
      artistIndex: 0,
    });
  }

  useEffect(() => {
    if (sequence?.stage !== "artist") return;

    const timer = setTimeout(() => {
      if (sequence.artistIndex === 0) {
        playArtistAudio(audioRef.current, sequence.artists[1]);

        setSequence({
          ...sequence,
          artistIndex: 1,
        });
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;

        setSequence({
          ...sequence,
          stage: "escape",
        });
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [sequence]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
      }
    };
  }, []);

  return { sequence, startReveal };
}