import React, { useEffect, useState, useRef } from 'react';
import { Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanyardData {
  data: {
    discord_user: {
      id: string;
      username: string;
      avatar: string;
    };
    discord_status: string;
  };
}

export function Friends() {
  const { t } = useTranslation();
  const [friends, setFriends] = useState<Map<string, LanyardData['data']>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [friendsVisible, setFriendsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const friendsRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(true);
  const intervalRef = useRef<number>();

  const friendIds = [
    '1091415573990219806',
    '1271926225904078952',
    '1139275573261258884',
    '998924038439190638',
    '943174184278847560',
    '1292960011471032393'
  ];

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setFriendsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (friendsRef.current) {
      observer.observe(friendsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchFriend = async (id: string, controller: AbortController) => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${id}`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error?.message || 'Failed to fetch user data');
        }

        return { id, data: data.data };
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw error;
        }
        console.error(`Error fetching friend ${id}:`, error);
        throw error;
      }
    };

    const fetchFriends = async () => {
      if (!mounted.current) return;

      const controller = new AbortController();
      setIsLoading(true);
      setError(null);

      try {
        const fetchPromises = friendIds.map(id => fetchFriend(id, controller));
        const results = await Promise.allSettled(fetchPromises);

        if (!mounted.current) return;

        const newFriends = new Map();
        let hasSuccessfulFetch = false;

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const { id, data } = result.value;
            if (data?.discord_user) {
              newFriends.set(id, data);
              hasSuccessfulFetch = true;
            }
          }
        });

        if (!hasSuccessfulFetch) {
          throw new Error('Failed to fetch any friend data');
        }

        setFriends(newFriends);
        setError(null);
        setRetryCount(0);
      } catch (err) {
        if (!mounted.current) return;
        if (err instanceof Error && err.name === 'AbortError') return;

        console.error('Error fetching friends:', err);
        setError(t('friends.error'));
        
        if (retryCount < 3) {
          const timeout = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            if (mounted.current) {
              setRetryCount(prev => prev + 1);
            }
          }, timeout);
        }
      } finally {
        if (mounted.current) {
          setIsLoading(false);
        }
      }
    };

    fetchFriends();
    intervalRef.current = window.setInterval(fetchFriends, 30000);

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [retryCount, t]);

  const handleRetry = () => {
    setRetryCount(0);
  };

  if (error) {
    return (
      <section id="friends" className="py-24 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? t('friends.loading') : t('friends.retry')}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={friendsRef} id="friends" className="py-24 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <Users className="w-8 h-8" />
            {t('friends.title')}
          </h2>
          <p className="text-gray-600">{t('friends.subtitle')}</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {friendIds.map((id, index) => {
            const friend = friends.get(id);
            if (!friend) {
              return (
                <div
                  key={id}
                  className="animate-pulse flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              );
            }

            return (
              <div
                key={id}
                className={`animate-soft-appear ${friendsVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src={`https://cdn.discordapp.com/avatars/${friend.discord_user.id}/${friend.discord_user.avatar}.png?size=256`}
                      alt={friend.discord_user.username}
                      className="w-24 h-24 rounded-full shadow-lg transition-transform duration-300 hover:scale-110"
                      loading="lazy"
                    />
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      friend.discord_status === 'online' ? 'bg-green-500' :
                      friend.discord_status === 'idle' ? 'bg-yellow-500' :
                      friend.discord_status === 'dnd' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {friend.discord_user.username}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}