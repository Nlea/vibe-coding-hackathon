export interface VinylInformation {
  title: string;
  artists: string[];
  label: string;
  year: number;
  tracklist: { title: string; duration: string }[];
  genre?: string[];
  style?: string[];
  discogsMasterUrl?: string;
  discogsUri?: string;
  owner: string;
  imageUrl?: string;
}

export interface VinylData {
  title: string;
  artists: string;
  label: string;
  year: number;
  genre: string;
  style?: string;
  owner: string;
  imageUrl?: string;
}

export interface CardData {
  username: string;
  activity: string;
  color: string;
  thumbnail_key: string;
  artStyle: string;
  imageUrl: string;
}