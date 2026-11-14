import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const genres = [
  "rock",
  "metal",
  "hip hop",
  "r&b",
  "pop",
  "jazz",
  "blues",
  "country",
  "electronic",
  "reggae",
  "classical",
  "punk",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function fetchWithRetry(url) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "PulseReveal/1.0 (student educational project)",
          Accept: "application/json",
        },
      });

      if (response.ok) return response;

      if (![429, 502, 503, 504].includes(response.status)) {
        throw new Error(`MusicBrainz HTTP ${response.status}`);
      }

      console.log(`HTTP ${response.status}. Retry ${attempt}/5`);
    } catch (error) {
      if (attempt === 5) throw error;
      console.log(`Connection issue. Retry ${attempt}/5`);
    }

    await sleep(3000 * attempt);
  }

  throw new Error("MusicBrainz unavailable after 5 attempts");
}

async function importArtists() {
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const genre of genres) {
    console.log(`\nFetching ${genre}...`);

    const url = new URL("https://musicbrainz.org/ws/2/artist/");
    url.searchParams.set("query", `tag:"${genre}"`);
    url.searchParams.set("fmt", "json");
    url.searchParams.set("limit", "50");

    try {
      const response = await fetchWithRetry(url);

      if (!response.ok) {
        throw new Error(`MusicBrainz HTTP ${response.status}`);
      }

      const data = await response.json();

      for (const artist of data.artists ?? []) {
        if (!artist.id || !artist.name) continue;

        const { data: existing, error: lookupError } = await supabase
          .from("artists")
          .select("id")
          .eq("musicbrainz_id", artist.id)
          .maybeSingle();

        if (lookupError) {
          failed++;
          console.error(`Lookup failed: ${artist.name}`, lookupError.message);
          continue;
        }

        if (existing) {
          skipped++;
          continue;
        }

        const { error } = await supabase.from("artists").insert({
          artist_name: artist.name,
          musicbrainz_id: artist.id,
          genre,
          genres: [genre],
          status: "approved",
        });

        if (error) {
          failed++;
          console.error(`Insert failed: ${artist.name}`, error.message);
        } else {
          inserted++;
        }
      }

      console.log(`${genre}: processed ${(data.artists ?? []).length}`);
    } catch (error) {
      failed++;
      console.error(`${genre}: ${error.message}`);
    }

    await sleep(1200);
  }

  console.log("\nIMPORT COMPLETE");
  console.log(`New artists: ${inserted}`);
  console.log(`Already existed: ${skipped}`);
  console.log(`Failures: ${failed}`);
}

importArtists().catch(console.error);
