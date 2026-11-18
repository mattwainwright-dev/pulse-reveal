import { useState } from "react";
import "./App.css";
import { useTable } from "./hooks/useTable";
import { useRevealSequence } from "./hooks/useRevealSequence";
import ArtistCard from "./components/ArtistCard";
import ArtistPresentation from "./components/ArtistPresentation";

const featuredNames = ["The Illusionz", "0nce0nFire"];

function App() {
  const { data: artists, loading, error } = useTable("artists");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const { sequence, startReveal } = useRevealSequence();

  const featuredArtists = artists.filter((artist) =>
    featuredNames.includes(artist.artist_name),
  );

  const catalogArtists = artists.filter(
    (artist) => !featuredNames.includes(artist.artist_name),
  );

  const genres = [...new Set(catalogArtists.map((artist) => artist.genre))]
    .filter(Boolean)
    .sort();

  const filteredArtists = catalogArtists.filter((artist) => {
    const matchesSearch = (artist.artist_name || "")
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    const matchesGenre = !genre || artist.genre === genre;

    return matchesSearch && matchesGenre;
  });

  const showCatalog = search.trim() !== "" || genre !== "";

  function clearFilters() {
    setSearch("");
    setGenre("");
  }

  if (sequence?.stage === "artist") {
    const activeArtist = sequence.artists[sequence.artistIndex];

    return (
      <main className="app reveal-active">
        <ArtistPresentation
          key={activeArtist.id}
          artist={activeArtist}
        />
      </main>
    );
  }

  if (sequence?.stage === "escape") {
    return (
      <main
        className="app reveal-active"
        aria-label="Tenor escape scene"
      />
    );
  }

   return (
    <div className="app">
      <header>
        <h1>PULSE</h1>
        <p>Bring Music To Your Life</p>
      </header>

      <main>
        <section aria-labelledby="explore-heading">
          <h2 id="explore-heading">Explore All Artists</h2>

          <div className="artist-filters">
            <input
              type="search"
              placeholder="Search artists by name..."
              aria-label="Search artists"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              aria-label="Filter artists by genre"
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
            >
              <option value="">All genres</option>
              {genres.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button type="button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>

          {loading && <p>Loading artists...</p>}
          {error && <p>Error: {error}</p>}

          {!loading && !error && artists.length === 0 && (
            <p>No artists available yet.</p>
          )}

          {showCatalog && !loading && !error && (
            <>
              <p role="status">{filteredArtists.length} matching artists</p>

              {filteredArtists.length === 0 ? (
                <p>No matching artists found.</p>
              ) : (
                <div className="artist-grid">
                  {filteredArtists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <section aria-labelledby="featured-heading">
          <div className="reveal-cta">
            <h2 id="featured-heading">Two worlds. One pulse.</h2>
            <p>Click either featured artist to begin. Sound on.</p>
          </div>

          <div className="artist-grid">
            {featuredArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onSelect={(selectedArtist) =>
                  startReveal(selectedArtist, featuredArtists)
                }
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}


  export default App;