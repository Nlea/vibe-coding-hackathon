import { createFiberplane, createOpenAPISpec } from "@fiberplane/hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { vinyls } from "./db/schema";
import { getDiscogsInformation } from "./libs/discogs"; 
import EnterVinyl from "./templates/enterVinyl";
import GalleryTemplate from "./templates/gallery";
import { basicAuth } from 'hono/basic-auth'


type Bindings = {
  DATABASE_URL: string;
  DISCOGS_KEY: string;
  DISCOGS_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/*", jsxRenderer());

// Custom basic auth middleware
app.use(
  '/',
  basicAuth({
    username: 'demo',
    password: 'demo',
  })
)

app.get("/", (c) => {
  return c.html(<EnterVinyl />);
});

interface VinylResponse {
  title: string;
  artists: string;
  label: string;
  year: number;
  genre: string;
  style?: string;
  tracklist: string;
  owner: string;
}

app.post("/", async (c) => {
  const formData = await c.req.parseBody();
  const vinylData = {
    owner: formData.owner as string,
    barcode: formData.barcode as string,
    artist: formData.artist as string,
    title: formData.title as string
  };
  // Get the base URL from the request
  const url = new URL('/api/vinyl', c.req.url);
  const response = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(vinylData)
  });

  const result = await response.json() as VinylResponse;
  return c.html(
    <div class="result">
      <h2>Vinyl Information</h2>
      <p><strong>Title:</strong> {result.title}</p>
      <p><strong>Artist(s):</strong> {result.artists}</p>
      <p><strong>Label:</strong> {result.label}</p>
      <p><strong>Year:</strong> {result.year}</p>
      <p><strong>Genre:</strong> {result.genre}</p>
      {result.style && <p><strong>Style:</strong> {result.style}</p>}
      <p><strong>Owner:</strong> {result.owner}</p>
      <div>
        <strong>Tracklist:</strong>
        <div style="margin-left: 20px;">
          {Array.isArray(result.tracklist) ? (
            <ul style="list-style-type: none; padding: 0;">
              {result.tracklist.map((track, index) => (
                <li key={index}>
                  {track.title} {track.duration && `- ${track.duration}`}
                </li>
              ))}
            </ul>
          ) : (
            'No tracklist available'
          )}
        </div>
      </div>
      <div style="margin-top: 20px;">
        <a href="/gallery" class="button" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Show Gallery</a>
      </div>
    </div>
  );
});
app.get("/gallery", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  const vinylRecords = await db.select().from(vinyls);

  const formattedRecords = vinylRecords.map(record => ({
    title: record.title,
    artists: record.artists || 'Unknown Artist',
    label: record.label || 'Unknown Label',
    year: record.year || 0,
    genre: record.genre || 'Unknown Genre',
    style: record.style || undefined,
    owner: record.owner,
    imageUrl: record.imageUrl || undefined
  }));

  return c.html(<GalleryTemplate vinyls={formattedRecords} />);
});

app.get("/api/vinyls", async (c) => {
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

  return c.json({
    vinyls: await db.select().from(vinyls),
  });
});

app.post("/api/vinyl", async (c) => {
  const {barcode, artist, title, owner} = await c.req.json();

  const vinylInformation = await getDiscogsInformation(
    barcode || '',  // Empty string if undefined
    artist || '',   // Empty string if undefined
    title || '',  // Empty string if undefined
    c.env.DISCOGS_KEY,
    c.env.DISCOGS_SECRET,
    owner || ''  // Empty string if undefined
  );

  if (!vinylInformation || 'error' in vinylInformation) {
    return c.json({ error: vinylInformation?.error || 'Failed to fetch vinyl information' }, 500);
  }
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);

 
  await db.insert(vinyls).values({
    title: vinylInformation.title,
    artists: Array.isArray(vinylInformation.artists) ? vinylInformation.artists.join(',') : vinylInformation.artists,
    label: vinylInformation.label,
    year: typeof vinylInformation.year === 'number' ? vinylInformation.year : null,
    owner: owner,
    genre: Array.isArray(vinylInformation.genre) ? vinylInformation.genre.join(',') : vinylInformation.genre,
    tracklist: Array.isArray(vinylInformation.tracklist) ? vinylInformation.tracklist.join(',') : vinylInformation.tracklist,
    style: Array.isArray(vinylInformation.style) ? vinylInformation.style.join(',') : vinylInformation.style,
    discogsMasterUrl: vinylInformation.discogsMasterUrl,
    discogsUri: vinylInformation.discogsUri,
    imageUrl: vinylInformation.imageUrl || null
  });

  return c.json(vinylInformation);
}

)
  
/**
 * Serve a simplified api specification for your API
 * As of writing, this is just the list of routes and their methods.
 */

app.get("/openapi.json", (c) => {
  const spec = createOpenAPISpec(app, {
    info: { title: "My API", version: "1.0.0" }
  });
  return c.json(spec);
});
/**
 * Mount the Fiberplane api explorer to be able to make requests against your API.
 * 
 * Visit the explorer at `/fp`
 */
app.use("/fp/*", createFiberplane({
  app,
  openapi: { url: "/openapi.json" }
}));

export default app;

// Export the instrumented app if you've wired up a Fiberplane-Hono-OpenTelemetry trace collector
//
// export default instrument(app);
