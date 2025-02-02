import React, { useEffect, useState } from 'react';
import { Music } from 'lucide-react';

interface SpotifyBarProps {
  spotify: {
    song: string;
    artist: string;
    album_art_url: string;
    track_id?: string;
    timestamps?: {
      start: number;
      end: number;
    };
  } | null;
}

export function SpotifyBar({ spotify }: SpotifyBarProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [prevTrackId, setPrevTrackId] = useState<string | undefined>();

  useEffect(() => {
    if (!spotify?.timestamps) return;

    const updateProgress = () => {
      const now = Date.now();
      const start = spotify.timestamps.start;
      const end = spotify.timestamps.end;
      const duration = end - start;
      const elapsed = now - start;
      const newProgress = Math.min(100, (elapsed / duration) * 100);
      setCurrentProgress(elapsed);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 500);
    return () => clearInterval(interval);
  }, [spotify?.timestamps]);

  useEffect(() => {
    if (prevTrackId !== spotify?.track_id) {
      setIsChanging(true);
      const timer = setTimeout(() => {
        setIsChanging(false);
        setPrevTrackId(spotify?.track_id);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [spotify?.track_id, prevTrackId]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!spotify) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg bg-white p-6">
        <div className="flex items-center justify-center gap-2 text-gray-400">
          <Music className="w-5 h-5" />
          <span>Not playing anything</span>
        </div>
      </div>
    );
  }

  const duration = spotify.timestamps ? (spotify.timestamps.end - spotify.timestamps.start) : 0;
  const progressPercent = Math.min(100, (currentProgress / duration) * 100);

  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
      style={{ height: '160px' }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }}
      data-hover
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
        style={{
          backgroundImage: `url(${spotify.album_art_url})`,
          filter: 'blur(20px)',
          transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`,
        }}
      />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative h-full p-6 flex items-center gap-6">
        <div className={`transition-all duration-500 ${isChanging ? 'opacity-0 scale-95 rotate-12' : 'opacity-100 scale-100 rotate-0'}`}>
          <img 
            src={spotify.album_art_url} 
            alt="Album Art" 
            className="w-32 h-32 rounded-lg shadow-lg animate-gentle-float"
          />
        </div>
        <div className="flex-1 text-white">
          <div className={`flex items-center gap-2 mb-2 transition-all duration-300 ${isChanging ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <Music className="w-5 h-5 text-green-400 animate-spin-slow" />
            <p className="text-sm text-gray-300">Now Playing on Spotify</p>
          </div>
          <a 
            href={`https://open.spotify.com/track/${spotify.track_id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block font-medium text-2xl text-gray-100 hover:text-green-400 transition-colors duration-300 ${
              isChanging ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
            data-hover
          >
            {spotify.song}
          </a>
          <a 
            href={`https://open.spotify.com/search/${encodeURIComponent(spotify.artist)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block text-gray-300 text-lg hover:text-green-400 transition-colors duration-300 ${
              isChanging ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`}
            style={{ transitionDelay: '0.1s' }}
            data-hover
          >
            {spotify.artist}
          </a>
          
          {spotify.timestamps && (
            <div className={`mt-4 flex items-center gap-3 transition-all duration-500 ${
              isChanging ? 'opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
            }`} style={{ transitionDelay: '0.2s' }}>
              <span className="text-sm text-gray-300 w-12">
                {formatTime(currentProgress)}
              </span>
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-sm text-gray-300 w-12">
                {formatTime(duration)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}