import React, { useState, useRef } from 'react';
import { ExternalLink, Code, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Modal } from './Modal';

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  link: string;
  technologies: string[];
  features: string[];
}

export function ProjectCard({ 
  title, 
  description, 
  image, 
  link, 
  technologies = [], 
  features = [] 
}: ProjectCardProps) {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | undefined>();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleOpenModal = () => {
    if (cardRef.current) {
      setTriggerRect(cardRef.current.getBoundingClientRect());
      setShowDetails(true);
    }
  };

  const handleCloseModal = () => {
    if (cardRef.current) {
      setTriggerRect(cardRef.current.getBoundingClientRect());
      setShowDetails(false);
    }
  };

  return (
    <div className="relative" ref={cardRef}>
      <div className="group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl">
        <div className="aspect-video w-full overflow-hidden">
          <img 
            src={image} 
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              {title}
            </h3>
            <p className="text-gray-200 mb-4 max-w-md transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
              {description}
            </p>
            <button
              onClick={handleOpenModal}
              className="px-6 py-2 bg-white text-black rounded-lg font-medium transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150 hover:scale-105"
              data-hover
            >
              {t('projects.viewProject')}
            </button>
          </div>
        </div>
      </div>

      <Modal 
        isOpen={showDetails} 
        onClose={handleCloseModal}
        triggerRect={triggerRect}
      >
        <div className="modal-content">
          <div className="relative w-full h-64">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <h2 className="text-3xl font-bold text-white">{title}</h2>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Code className="w-5 h-5" />
                {t('projects.technologies')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    data-hover
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('projects.description')}</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {t('projects.features')}
              </h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                data-hover
              >
                <ExternalLink className="w-5 h-5" />
                {t('projects.visitProject')}
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}