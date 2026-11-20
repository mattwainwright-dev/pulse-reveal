function ArtistCard({ artist, onSelect }) {
  const name = artist.artist_name?.trim() || "Unnamed artist";

  if (onSelect) {
    const image = artist.image_url?.trim();

    return (
      <article className="artist-card">
        <button
          type="button"
          className="artist-card-trigger"
          onClick={() => onSelect(artist)}
          aria-label={`Start the PULSE reveal with ${name}`}
        >
          {image ? (
            <img src={image} alt={`Start ${name}'s presentation`} />
          ) : (
            <span>{name}</span>
          )}
        </button>
      </article>
    );
  }

  return (
    <article className="artist-card catalog-card">
      <img src="/images/pulse-universal.png" alt="Pulse music discovery" />

      <div className="catalog-card-info">
        <h3>{name}</h3>
        <p>{artist.genre?.trim() || "Genre unavailable"}</p>
        <p>{artist.bio?.trim() || "No biography available yet."}</p>

        <p>Pulse demo beat — created by Matthew Wainwright</p>
        <audio
          controls
          preload="none"
          src="/audio/pulse-demo-beat.m4a"
          aria-label={`Play the shared Pulse demo beat on ${name}'s card`}
          onPlay={(event) => {
            document.querySelectorAll("audio").forEach((audio) => {
              if (audio !== event.currentTarget) {
                audio.pause();
              }
            });
          }}
        >
          Your browser does not support audio playback.
        </audio>
      </div>
    </article>
  );
}

export default ArtistCard;
