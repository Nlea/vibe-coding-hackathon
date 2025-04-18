import { VinylData } from "../type";
import type { FC } from "hono/jsx";
import { css, Style } from "hono/css";

const GalleryTemplate: FC<{
  vinyls: VinylData[];
}> = ({ vinyls }) => {
  const gallery = css`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
    padding: 20px;
  `;

  const card = css`
    background-color: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 12px;
    transition: transform 0.2s ease;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
  `;

  const imageContainer = css`
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
  `;

  const image = css`
    width: 100%;
    height: 100%;
    object-fit: cover;
  `;

  const title = css`
    font-size: 1.4em;
    font-weight: bold;
    margin: 0;
    color: #2c3e50;
  `;

  const artist = css`
    color: #34495e;
    margin: 0;
    font-size: 1.1em;
  `;

  const details = css`
    display: grid;
    gap: 8px;
    color: #444;
    background-color: #f8f9fa;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.95em;
  `;

  const detailRow = css`
    display: flex;
    gap: 8px;
    align-items: baseline;
  `;

  const label = css`
    font-weight: 600;
    color: #666;
    min-width: 60px;
  `;

  const owner = css`
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid #eee;
    color: #666;
    font-size: 0.9em;
    display: flex;
    align-items: center;
    gap: 6px;
  `;

  return (
    <>
      <Style />
      <div class={gallery}>
        {vinyls.map((vinyl) => (
          <div class={card}>
            {vinyl.imageUrl && (
              <div class={imageContainer}>
                <img src={vinyl.imageUrl} alt={vinyl.title} class={image} />
              </div>
            )}
            <h3 class={title}>{vinyl.title}</h3>
            <p class={artist}>{vinyl.artists}</p>
            <div class={details}>
              <div class={detailRow}>
                <span class={label}>Label:</span>
                <span>{vinyl.label}</span>
              </div>
              <div class={detailRow}>
                <span class={label}>Year:</span>
                <span>{vinyl.year}</span>
              </div>
              <div class={detailRow}>
                <span class={label}>Genre:</span>
                <span>{vinyl.genre}</span>
              </div>
              {vinyl.style && (
                <div class={detailRow}>
                  <span class={label}>Style:</span>
                  <span>{vinyl.style}</span>
                </div>
              )}
            </div>
            <div class={owner}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {vinyl.owner}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default GalleryTemplate;