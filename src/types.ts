export interface LanyardResponse {
  data: {
    spotify: {
      track_id: string;
      timestamps: {
        start: number;
        end: number;
      };
      song: string;
      artist: string;
      album_art_url: string;
      album: string;
    } | null;
    listening_to_spotify: boolean;
    discord_status: string;
    activities: Array<{
      type: number;
      state: string;
      name: string;
      id: string;
      emoji?: {
        name: string;
        id: string | null;
        animated: boolean;
      };
      created_at: number;
    }>;
    discord_user: {
      username: string;
      public_flags: number;
      id: string;
      discriminator: string;
      avatar: string;
    };
  };
}