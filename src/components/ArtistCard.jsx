function ArtistCard({ artist, onSelect }) {
  const name = artist.artist_name?.trim();
    const image = artist.image_url?.trim() || null;

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