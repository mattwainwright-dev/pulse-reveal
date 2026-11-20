import { useState } from "react";

export default function AddArtistForm({ addRow, onAdded }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fields = new FormData(form);
    const artist = {
      artist_name: fields.get("artist_name").trim(),
      genre: fields.get("genre").trim(),
      bio: fields.get("bio").trim(),
    };

    if (!artist.artist_name || !artist.genre || !artist.bio) {
      setMessage("Please complete all three fields.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const saved = await addRow(artist);
      form.reset();
      onAdded(saved);
      setMessage(`${saved.artist_name} was added successfully.`);
    } catch (error) {
      setMessage(`Could not add artist: ${error.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section aria-labelledby="add-artist-heading">
      <h2 id="add-artist-heading">Add an artist</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Artist name
          <input name="artist_name" required maxLength={120} />
        </label>

        <label>
          Genre
          <input name="genre" required maxLength={80} />
        </label>

        <label>
          Bio
          <textarea name="bio" required maxLength={1200} />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Adding artist..." : "Add artist"}
        </button>

        <p role="status">{message}</p>
      </form>
    </section>
  );
}