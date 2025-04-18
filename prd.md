📄 Product Requirements Document (PRD)
Product Name:
VinylVault (working title)

Owner:
[Your Name]

Date:
April 18, 2025

1. Overview
Goal:
Build a mobile/web app for vinyl collectors to catalog their vinyl records using Discogs API, automatically retrieve metadata (tracklist, artist, album details), and enrich it with musical data like BPM and key. Users can then filter songs by BPM/key ranges and generate playlists for specific moods or DJ sets.

2. Features
2.1 Vinyl Collection Management
Add vinyl records by:

Artist + Title

Barcode/UPC (via manual input or camera scan)

Fetch data from Discogs API:

Album title, artist(s)

Release year, genre, label

Artwork

Track listing (title, duration)

Manual override/editing of imported info

2.2 Song Metadata Management
For each song (track on a vinyl):

Allow user to enter/edit:

BPM

Musical key (Camelot or standard notation)

Comments or tags

Optional: Integrate third-party audio analysis API for automatic BPM/key detection via user-uploaded audio clips

2.3 Search & Filters
Query/filter songs based on:

BPM range (e.g., 120–125 BPM)

Key or key compatibility (e.g., "8A", or compatible keys)

Genre or custom tags

2.4 Playlist Generation
Generate playlists based on:

BPM range

Compatible keys

Tags or genres

Export playlists:

In-app view

PDF/CSV download

Optional: Rekordbox/Traktor compatible formats

3. User Stories
🎧 Collector/DJ
"I want to scan the barcode of my vinyl and get all the info instantly."

"I want to add the BPM and key of each song so I can find tracks that mix well."

"I want to search for songs between 122 and 126 BPM in a compatible key for my set."

"I want to build playlists from my vinyl collection that are mix-friendly."

4. Technical Requirements
4.1 APIs
Discogs API:

Used for searching and retrieving vinyl metadata

Requires user authentication for higher rate limits

Optional: Audio analysis API (e.g., Mixed In Key, AudD, or EchoNest):

For extracting BPM and key from user-provided samples

4.2 Backend
Store users’ vinyls and song metadata

Enable full-text and parameter-based querying (BPM, key, genre)

4.3 Frontend
Mobile-first responsive design (React Native or Flutter suggested)

Barcode scanner support

Search interface with filters and playlist builder

4.4 Database Schema (Simplified)
Users

id, name, email, password_hash

Vinyls

id, user_id, discogs_id, title, artist, year, label, genre, barcode, cover_url

Tracks

id, vinyl_id, title, duration, bpm, key, tags

Playlists

id, user_id, name, description, created_at

PlaylistTracks

id, playlist_id, track_id

5. Nice-to-Haves
Dark mode

AI-generated tag suggestions based on genre/mood

Social sharing of playlists or collection highlights

Sync with streaming services for preview

6. Milestones

Milestone	Timeline
PRD Finalization & Planning	Week 1
API Integration (Discogs)	Week 2–3
Vinyl & Track Management UI	Week 4–6
BPM/Key Metadata Input	Week 6–7
Playlist Generator	Week 8
Search & Filter Functionality	Week 9
Beta Release	Week 10
7. Risks & Mitigations
Discogs API Rate Limits: Use authenticated access and implement caching

BPM/Key Data Accuracy: Allow manual overrides and crowd-sourced corrections

User-uploaded audio: Legal/privacy considerations; ensure no storage of copyrighted content

