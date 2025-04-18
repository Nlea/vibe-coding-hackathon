VinylVault – Data Model (ERD)
🔗 Entity Relationship Diagram (Textual Representation)
nginx
Copy
Edit
Users
│
├───< Vinyls
│     └───< Tracks
│             └── PlaylistTracks >─── Playlists
📦 Entities & Fields
1. Users

Field	Type	Description
id	UUID (PK)	Unique user identifier
email	String	User email
password_hash	String	Hashed password
name	String	Display name
created_at	Timestamp	Account creation time
2. Vinyls

Field	Type	Description
id	UUID (PK)	Unique vinyl identifier
user_id	UUID (FK)	References Users
discogs_id	String	Discogs release ID
title	String	Album title
artist	String	Main artist name
year	Integer	Release year
genre	String	Primary genre
label	String	Record label
barcode	String	EAN/UPC/barcode number
cover_url	String	Album art URL
notes	Text	Optional user notes
created_at	Timestamp	When added to collection
3. Tracks

Field	Type	Description
id	UUID (PK)	Unique track ID
vinyl_id	UUID (FK)	References Vinyls
title	String	Track title
duration	String	e.g., "04:32"
position	String	Vinyl position (A1, B2, etc.)
bpm	Integer	Beats per minute
key	String	Musical key (e.g., 8A, F#m, etc.)
tags	String[]	Array of user-defined tags
comments	Text	User comments or mixing notes
4. Playlists

Field	Type	Description
id	UUID (PK)	Unique playlist ID
user_id	UUID (FK)	References Users
name	String	Playlist name
description	Text	Optional description
created_at	Timestamp	Created date
5. PlaylistTracks (Join Table)

Field	Type	Description
id	UUID (PK)	Unique ID
playlist_id	UUID (FK)	References Playlists
track_id	UUID (FK)	References Tracks
position	Integer	Optional ordering in playlist
📘 Notes
Discogs ID: Stored to avoid duplication and support future re-sync or detail fetches.

Tags: Can be genres, moods, or anything user-defined, stored as a string array or normalized if needed.

Key Compatibility Logic: Implemented at the application layer (e.g., Camelot key wheel matching).