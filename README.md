
# PULSE — Reveal

**Bring Music To Your Life.**

## Problem Statement

Music fans need a welcoming place to discover artists across genres, while independent artists need opportunities to be seen alongside established performers.

PULSE is a music discovery and community platform designed to bring artists and listeners together.

## User Persona

**Primary User:** Music lovers who enjoy discovering new artists and exploring different genres.

**Goals:**
- Discover independent and established artists.
- Explore music across multiple genres.
- Learn about artists and their music.
- Connect with a growing music community.

**Secondary User:** Independent musicians looking for greater visibility and opportunities to reach listeners.

## Project Scope

PULSE Reveal is a React and Supabase application developed for the CodeX Level 3 Capstone.

### Current Features

- React application built with Vite.
- Supabase database integration.
- Artist information retrieved using a custom `useTable` hook.
- Featured artist cards for The Illusionz and 0nce0nFire.
- An Explore All Artists catalog.
- Artist names, genres, and biographies.
- JavaScript `filter()` and `map()` methods to organize and display artist records.
- Loading, error, and empty-data handling.
- MusicBrainz artist importer for expanding the catalog.

### Future Development

- Expanded artist profiles and music playback.
- Artist submissions and approval workflows.
- Interactive music discovery.
- Community engagement features.
- The PULSE cinematic reveal experience.

## Supabase Table Design

**Table:** `public.artists`

| Column | Data Type | Purpose |
|---|---|---|
| id | bigint | Unique artist record identifier |
| created_at | timestamptz | Record creation timestamp |
| artist_name | text | Artist or band name |
| genre | text | Primary music genre |
| genres | text[] | Additional genre classifications |
| bio | text | Artist biography |
| image_url | text | Artist image URL |
| audio_url | text | Artist audio URL |
| status | text | Artist approval status |
| musicbrainz_id | uuid | MusicBrainz artist identifier |

## System Explanation

PULSE Reveal uses React for the frontend and Supabase for database storage.

### How the Application Works

1. Artist records are stored in the Supabase `artists` table.
2. The custom `useTable` hook retrieves records using the Supabase JavaScript client.
3. `App.jsx` receives the artist data along with loading and error states.
4. JavaScript `filter()` separates featured artists from the general catalog.
5. JavaScript `map()` generates reusable `ArtistCard` components.
6. `ArtistCard.jsx` displays each artist's name, genre, biography, and available artwork.
7. The MusicBrainz importer allows the artist catalog to expand without manually entering every artist.

### Data Flow

Supabase Database → useTable Hook → App.jsx → ArtistCard.jsx → Browser

### Technologies

- React
- JavaScript
- HTML
- CSS
- Vite
- Supabase
- MusicBrainz API
- Git and GitHub
- Netlify

## Capstone Plan

[View PULSE Reveal Capstone Plan](https://docs.google.com/document/d/1mQySxORC2Bp30ZHNkmuCxnYR95Vv0X6jM_2CmppKQQk/edit?usp=sharing)

## Wireframe

![PULSE Reveal Wireframe](wireframe.png)

## Team

Pod collaboration document: **Link pending**

## Project Links

**Live Application:**  
https://dulcet-malabi-a6972c.netlify.app/

**GitHub Repository:**  
https://github.com/mattwainwright-dev/pulse-reveal

---

**PULSE — Bring Music To Your Life.**
