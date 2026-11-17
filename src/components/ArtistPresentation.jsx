import { useEffect, useState } from "react";
import "./ArtistPresentation.css";

function ArtistPresentation({ artist }) {
  const [elapsed, setElapsed] = useState(0);

  const prefix =
    artist.artist_name.trim().toLowerCase() === "the illusionz"
      ? "tig"
      : "tenor";

  // All content below comes from the fetched Supabase record.
  const status = (artist.artist_status || "")
    .toUpperCase()
    .split("")
    .join(" ");

  const fullText = [
    artist.artist_name,
    `BIO\n${artist.bio || ""}`,
    `MEMBERS\n${artist.members || ""}`,
    `YOUTUBE\n${artist.youtube_url || ""}`,
    `S T A T U S — ${status}`,
  ].join("\n\n");

  // One clock controls image changes and ten seconds of typing.
  useEffect(() => {
    let frame;
    const start = performance.now();

    function tick(now) {
      const milliseconds = Math.min(now - start, 10000);
      setElapsed(milliseconds);

      if (milliseconds < 10000) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [artist.id]);

  const imageIndex = Math.min(Math.floor(elapsed / 5000), 2);
  const characterCount = Math.floor(
    (elapsed / 10000) * fullText.length,
  );
  const typingComplete = elapsed >= 10000;

  return (
    <section
      className="artist-presentation"
      aria-label={`${artist.artist_name} presentation`}
    >
      <div className="hologram">
        <img
          className="hologram-image"
          src={`/images/${prefix}-0${imageIndex + 1}.jpg`}
          alt={`${artist.artist_name}, image ${imageIndex + 1} of 3`}
        />
      </div>

      <div className="artist-terminal">
        <pre aria-hidden="true">
          {fullText.slice(0, characterCount)}
          {typingComplete && (
            <span className="terminal-dots">.</span>
          )}
        </pre>

        <p className="terminal-accessible">{fullText}</p>
      </div>
    </section>
  );
}

export default ArtistPresentation;