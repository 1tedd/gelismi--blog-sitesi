import React, { useEffect, useState } from 'react';
import { User, Users, Instagram, Disc, Code, Music } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SpotifyBar } from './components/SpotifyBar';
import { CursorFollower } from './components/CursorFollower';
import { LoadingScreen } from './components/LoadingScreen';
import { ProjectCard } from './components/ProjectCard';
import { SkillChart } from './components/SkillChart';
import { Friends } from './components/Friends';
import { WeatherCard } from './components/WeatherCard';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import type { LanyardResponse } from './types';

function App() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<LanyardResponse['data'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const data = await fetch('https://api.lanyard.rest/v1/users/402607131016036352');
        if (!data.ok) throw new Error('Failed to fetch user data');
        const json = await data.json();
        if (!json.success) throw new Error(json.error?.message || 'Failed to fetch user data');
        setUserData(json.data);
        setError(null);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Error fetching user data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch user data');
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => {
      abortController.abort();
      clearInterval(interval);
    };
  }, []);

  const customStatus = userData?.activities?.find(activity => activity.type === 4);

  const skills = [
    { name: 'JavaScript', percentage: 90, color: '#f7df1e' },
    { name: 'TypeScript', percentage: 85, color: '#3178c6' },
    { name: 'React', percentage: 88, color: '#61dafb' },
    { name: 'Node.js', percentage: 82, color: '#339933' },
    { name: 'Python', percentage: 75, color: '#3776ab' },
    { name: 'HTML/CSS', percentage: 95, color: '#e34f26' },
  ];

  const projects = [
    {
      title: t('projects.discordBot.title'),
      description: t('projects.discordBot.description'),
      image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41",
      link: "https://discord.gg/cortexbot",
      technologies: ["Node.js", "Discord.js", "MongoDB"],
      features: t('projects.discordBot.features', { returnObjects: true })
    },
    {
      title: t('projects.portfolio.title'),
      description: t('projects.portfolio.description'),
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      link: "https://discord.gg/cortexbot",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      features: t('projects.portfolio.features', { returnObjects: true })
    },
    {
      title: t('projects.game.title'),
      description: t('projects.game.description'),
      image: "https://images.unsplash.com/photo-1556438064-2d7646166914",
      link: "https://discord.gg/cortexbot",
      technologies: ["Three.js", "WebSocket", "Express"],
      features: t('projects.game.features', { returnObjects: true })
    }
  ];

  return (
    <>
      <CursorFollower />
      <LoadingScreen onFinished={() => setIsLoading(false)} />
      <div className={`min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Navigation */}
        <nav className="fixed w-full z-50 backdrop-blur-md bg-[var(--bg-primary)]/70 shadow-sm border-b border-[var(--border-color)]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between">
              <div className="flex-shrink-0">
                <div className="text-xl font-bold">Ted</div>
              </div>

              <div className="flex-1 flex justify-center space-x-8 mx-8">
                <a 
                  href="#home"
                  className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all duration-300 transform hover:scale-105"
                >
                  {t('nav.home')}
                </a>
                <a 
                  href="#about"
                  className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all duration-300 transform hover:scale-105"
                >
                  {t('nav.about')}
                </a>
                <a 
                  href="#projects"
                  className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-all duration-300 transform hover:scale-105"
                >
                  {t('nav.projects')}
                </a>
              </div>

              <div className="flex items-center gap-4">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section id="home" className="relative overflow-hidden pt-16 bg-[var(--bg-primary)]">
          <div className="max-w-screen-xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
            <div className="text-center animate-fade-in">
              {userData?.discord_user && (
                <img
                  src={`https://cdn.discordapp.com/avatars/${userData.discord_user.id}/${userData.discord_user.avatar}.png?size=256`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto mb-8 border-4 border-[var(--border-color)] shadow-lg animate-gentle-float"
                />
              )}
              <h1 className="text-4xl font-bold text-[var(--text-primary)] sm:text-5xl mb-4">
                {userData?.discord_user?.username || 'Loading...'}
              </h1>
              {customStatus && (
                <p className="text-[var(--text-secondary)] mb-8">{customStatus.state}</p>
              )}
              <SpotifyBar spotify={userData?.spotify} />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 bg-[var(--bg-secondary)]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8 text-center flex items-center justify-center gap-2">
              <User className="w-6 h-6" />
              {t('about.title')}
            </h2>
            <p className="text-lg text-[var(--text-secondary)] text-center mb-16 max-w-3xl mx-auto">
              {t('about.description')}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {skills.map((skill) => (
                <SkillChart
                  key={skill.name}
                  name={skill.name}
                  percentage={skill.percentage}
                  color={skill.color}
                  triggerAnimation={!isLoading}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Friends Section */}
        <Friends />

        {/* Projects Section */}
        <section id="projects" className="py-24 bg-[var(--bg-primary)]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8 text-center flex items-center justify-center gap-2">
              <Code className="w-6 h-6" />
              {t('projects.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 bg-[var(--bg-secondary)]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-8 text-center">
              {t('contact.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Discord Contact */}
              <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-[var(--bg-primary)]">
                <img
                  src="https://cdn.discordapp.com/banners/675030984722350092/b2646b9a350d591f44e91772d25522f4.webp?size=4096"
                  alt="Discord Banner"
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="bg-[var(--bg-primary)] p-8">
                  <div className="flex flex-col items-center">
                    <img
                      src="https://cdn.discordapp.com/icons/675030984722350092/f28ea682537a86a99dad8e029a6795a8.webp?size=4096"
                      alt="Discord Server Icon"
                      className="w-24 h-24 rounded-full -mt-20 border-4 border-[var(--bg-primary)] shadow-lg transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-2">
                      {t('contact.discord.title')}
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-4 text-center">
                      {t('contact.discord.description')}
                    </p>
                    <a
                      href="https://discord.gg/cortexbot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-[#5865F2] text-white rounded-lg hover:bg-[#4752C4] transition-all duration-300 transform hover:scale-105"
                    >
                      <Disc className="w-5 h-5" />
                      <span>{t('contact.discord.button')}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Instagram Contact */}
              <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 bg-[var(--bg-primary)]">
                <img
                  src="https://cdn.discordapp.com/attachments/1209193064040763462/1335261085795750000/lJYSETchPYqqHEyzm3YzSWprhkYmZTznsoabX1Pq50DU9KUgmu7Da4ygGT32r6rLnqHMM_o7r4MXa-QX8J_H4LdC9AxROGtIKpTy67xFgHWRQpgh6-HzCUGAwgxWoE7CMObAAO31VxeO-hqC5i2s4bISFBeIH9_3h7ADGj0Cn6EYwxJEFxiMt-5AeJ9uTtP1z9N-XF1mMm03Wa4.png?ex=679f864a&is=679e34ca&hm=61d59c282faeec4565b23c145df4de2780eb1b89845e94eddc71d0e927eb154e&"
                  alt="Instagram Banner"
                  className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="bg-[var(--bg-primary)] p-8">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full -mt-20 border-4 border-[var(--bg-primary)] shadow-lg bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110">
                      <Instagram className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text-primary)] mt-4 mb-2">
                      {t('contact.instagram.title')}
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-4 text-center">
                      {t('contact.instagram.description')}
                    </p>
                    <a
                      href="https://www.instagram.com/merhabalar.ben.volkan.konak/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-[#E4405F] text-white rounded-lg hover:bg-[#D63251] transition-all duration-300 transform hover:scale-105"
                    >
                      <Instagram className="w-5 h-5" />
                      <span>{t('contact.instagram.button')}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weather Widget */}
        <WeatherCard />

        {/* Footer */}
        <footer className="bg-[var(--bg-primary)] py-8 border-t border-[var(--border-color)]">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-[var(--text-secondary)]">
              <p className="text-sm">
                © {new Date().getFullYear()} <span className="font-semibold">1ted_</span>. {t('footer.rights')}
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;