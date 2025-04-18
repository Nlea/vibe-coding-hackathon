import { createFiberplane, createOpenAPISpec } from "@fiberplane/hono";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { getCookie, setCookie } from "hono/cookie";
import { users, vinyls } from "./db/schema";
import { getDiscogsInformation } from "./libs/discogs";
import { authMiddleware, comparePasswords, generateJWT, hashPassword, verifyJWT } from "./libs/auth";
import EnterVinyl from "./templates/enterVinyl";
import GalleryTemplate from "./templates/gallery";
import LoginTemplate from "./templates/login";
import RegisterTemplate from "./templates/register";
import { eq } from "drizzle-orm";

type Bindings = {
  DATABASE_URL: string;
  DISCOGS_KEY: string;
  DISCOGS_SECRET: string;
  JWT_SECRET: string;
};

type Variables = {
  user: {
    id: number;
    email: string;
    name: string;
  };
};

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use("/*", jsxRenderer());

// Public routes
app.get("/auth/login", (c) => c.html(<LoginTemplate />));
app.get("/auth/register", (c) => c.html(<RegisterTemplate />));

// Auth routes
app.post("/auth/register", async (c) => {
  const { name, email, password } = await c.req.parseBody();
  
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  
  // Check if user exists
  const existingUser = await db.select().from(users).where(eq(users.email, email as string)).limit(1);
  if (existingUser.length > 0) {
    return c.html(<RegisterTemplate error="Email already registered" />);
  }
  
  // Create user
  const hashedPassword = await hashPassword(password as string);
  const [user] = await db.insert(users).values({
    name: name as string,
    email: email as string,
    password: hashedPassword,
    settings: {}
  }).returning();
  
  // Generate JWT
  const token = await generateJWT({
    id: user.id,
    email: user.email,
    name: user.name
  });
  
  // Set cookie and redirect
  setCookie(c, 'auth', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax'
  });
  return c.redirect('/');
});

app.post("/auth/login", async (c) => {
  const { email, password } = await c.req.parseBody();
  
  const sql = neon(c.env.DATABASE_URL);
  const db = drizzle(sql);
  
  // Find user
  const [user] = await db.select().from(users).where(eq(users.email, email as string)).limit(1);
  if (!user) {
    return c.html(<LoginTemplate error="Invalid email or password" />);
  }
  
  // Verify password
  const isValid = await comparePasswords(password as string, user.password);
  if (!isValid) {
    return c.html(<LoginTemplate error="Invalid email or password" />);
  }
  
  // Generate JWT
  const token = await generateJWT({
    id: user.id,
    email: user.email,
    name: user.name
  });
  
  // Set cookie and redirect
  setCookie(c, 'auth', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax'
  });
  return c.redirect('/');
});

app.get("/auth/logout", (c) => {
  setCookie(c, 'auth', '', { maxAge: 0 });
  return c.redirect('/auth/login');
});

// Protected routes middleware
app.use("/*", async (c, next) => {
  // Skip auth for login and register routes
  if (c.req.path.startsWith('/auth/')) {
    return next();
  }
  
  const token = getCookie(c, 'auth');
  if (!token) {
    return c.redirect('/auth/login');
  }
  
  try {
    const user = await verifyJWT(token);
    c.set('user', user);
    await next();
  } catch (e) {
    return c.redirect('/auth/login');
  }
})

// Protected routes
app.get("/", async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/auth/login');
  }
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
