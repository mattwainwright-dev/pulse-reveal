import { useState } from "react";
import "./App.css";
import { useTable } from "./hooks/useTable";
import { useRevealSequence } from "./hooks/useRevealSequence";
import ArtistCard from "./components/ArtistCard";
import ArtistPresentation from "./components/ArtistPresentation";
import AddArtistForm from "./components/AddArtistForm";

const featuredNames = ["The Illusionz", "0nce0nFire"];

function App() {
  const { data: artists, loading, error, addRow } = useTable("artists");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const { sequence, startReveal, audioRef } = useRevealSequence();

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
        <ArtistPresentation key={activeArtist.id} artist={activeArtist} />
      </main>
    );
  }

  if (sequence?.stage === "intro" || sequence?.stage === "complete") {
    return (
      <main
        aria-label="PULSE cinematic"
        style={{ position: "fixed", inset: 0, background: "#000" }}
      />
    );
  }

  if (sequence?.stage === "escape") {
    return (
      <main style={{ position: "fixed", inset: 0, background: "#000" }}>
        <video
          src="/video/PULSE_Two_Added_Lines_Review.mp4"
          muted
          autoPlay
          playsInline
          preload="auto"
          aria-label="PULSE cinematic reveal"
          onLoadedMetadata={(event) => {
            event.currentTarget.currentTime = Math.max(
              0,
              audioRef.current.current,
            );
          }}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            const audio = audioRef.current;
            if (!audio) return;

            const target = Math.max(0, audio.currentTime);
            if (Math.abs(video.currentTime - target) > 0.08) {
              video.currentTime = target;
            }
          }}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </main>
    );
  }

  return (
    <div className="app">
      <div className="pulse-particles" aria-hidden="true">
        {Array.from({ length: 36 }, (_, index) => (
          <span
            key={index}
            style={{
              "--left": `${(index * 37) % 100}%`,
              "--top": `${(index * 23) % 100}%`,
              "--duration": `${14 + (index % 9) * 2}s`,
              "--delay": `${-index * 1.7}s`,
              "--size": `${2 + (index % 3)}px`,
            }}
          />
        ))}
      </div>

      <header className="pulse-hero">
        <h1>
          <img
            src="/images/pulse-hero.png"
            alt="PULSE"
            className="pulse-hero-logo"
          />
        </h1>
        <p>Bring Music To Your Life.</p>
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

          <AddArtistForm
            addRow={addRow}
            onAdded={(artist) => {
              setSearch(artist.artist_name);
              setGenre("");
            }}
          />

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
            <p className="crossover-title">PULSE × SYNTH NOVA</p>

            <div className="mission-brief">
              <h3>MISSION BRIEF</h3>

              <p>
                <strong>There is great power in creativity.</strong>
              </p>

              <p>
                PULSE is built on the belief that what connects us is stronger
                than what divides us—and music can help us find that connection.
                Synth Nova tells a story of resistance, courage, and the fight
                for freedom. Together, these worlds share a mission: to unite
                humanity through music and art, inspiring the courage to stand
                together against oppression and tyranny, and build something better.

                This project features The Illusionz and 0nce0nFire—two artists bringing the spirit of these worlds to life.
              </p>
            </div>

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

      <footer className="pulse-footer">
        <p className="pulse-footer-brand">PULSE</p>
        <p>Bring Music To Your Life.</p>
        <p className="pulse-footer-signature">🤘 Music For The People 🫶</p>
        <small>
          © {new Date().getFullYear()} Matthew Wainwright · CodeX Level 3
          Capstone
        </small>
      </footer>
    </div>
  );
}

export default App;
