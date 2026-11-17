function ArtistCard({ artist, onSelect }) {
  const name = artist.artist_name?.trim();
  const normalizedName = name?.toLowerCase();

  const image =
    normalizedName === "the illusionz"
      ? "/images/the-illusionz-5.png"
      : normalizedName === "0nce0nfire"
        ? "/images/once-on-fire-2.png"
        : null;

  const artwork = image ? (
    <img src={image} alt={`Start ${name}'s presentation`} />
  ) : (
    <span>{name}</span>
  );

  return (
    <article className="artist-card">
      {onSelect ? (
        <button
          type="button"
          className="artist-card-trigger"
          onClick={() => onSelect(artist)}
          aria-label={`Start the PULSE reveal with ${name}`}
        >
          {artwork}
        </button>
      ) : (
        artwork
      )}
    </article>
  );
}

export default ArtistCard;