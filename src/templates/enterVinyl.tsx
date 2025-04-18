import type { FC } from "hono/jsx";
import { css, Style } from "hono/css";

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

interface VinylFormData {
  owner: string;
  barcode: string;
  artist: string;
  title: string;
}

const EnterVinyl: FC = () => {
  const form = css`
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
  `;

  const formGroup = css`
    margin-bottom: 20px;
  `;

  const input = css`
    width: 100%;
    padding: 8px;
    margin-top: 4px;
    border: 1px solid #ccc;
    border-radius: 4px;
  `;

  const button = css`
    background-color: #4a90e2;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    &:hover {
      background-color: #357abd;
    }
  `;

  const result = css`
    margin-top: 20px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 4px;
  `;

  const resultTitle = css`
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 10px;
  `;

  const resultItem = css`
    margin-bottom: 8px;
  `;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      owner: form.owner.value,
      barcode: form.barcode.value,
      artist: form.artist.value,
      title: form.title.value
    };
    


    // Submit the form normally
    form.submit();
  };

  return (
    <>
      <Style />
      <form action="/" method="post" class={form}>
        <div class={formGroup}>
          <label for="owner">Vinyl Owner</label>
          <input
            type="text"
            id="owner"
            name="owner"
            class={input}
            required
          />
        </div>

        <div class={formGroup}>
          <label for="barcode">Barcode</label>
          <input
            type="text"
            id="barcode"
            name="barcode"
            class={input}
          />
        </div>

        <div class={formGroup}>
          <label for="artist">Artist</label>
          <input
            type="text"
            id="artist"
            name="artist"
            class={input}
            required
          />
        </div>

        <div class={formGroup}>
          <label for="title">Album Title</label>
          <input
            type="text"
            id="title"
            name="title"
            class={input}
            required
          />
        </div>

        <button type="submit" class={button}>Search Vinyl</button>
      </form>

    </>
  );
};

export default EnterVinyl;