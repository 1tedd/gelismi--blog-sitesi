import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { languages } from '../i18n';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentLanguage = languages[i18n.language as keyof typeof languages] || languages.en;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string, index: number) => {
    setSelectedIndex(index);
    setTimeout(() => {
      i18n.changeLanguage(code);
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 300);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-full
          bg-gradient-to-r from-blue-500 to-blue-600
          hover:from-blue-600 hover:to-blue-700
          text-white shadow-lg hover:shadow-xl
          transform transition-all duration-300
          ${isOpen ? 'scale-110' : 'scale-100'}
          min-w-[88px] justify-center
        `}
        aria-label="Change Language"
      >
        <Globe className={`w-4 h-4 transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
        <span className="text-sm transform transition-all duration-300 hover:scale-110">
          {currentLanguage.flag}
        </span>
      </button>

      <div
        className={`
          absolute right-0 mt-4 w-56 bg-white rounded-2xl shadow-2xl z-50
          transform transition-all duration-300 origin-top-right
          backdrop-blur-lg bg-white/90 border border-white/20
          ${isOpen 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
          }
        `}
      >
        <div className="p-2">
          {Object.entries(languages).map(([code, { nativeName, flag }], index) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code, index)}
              className={`
                w-full px-4 py-3 rounded-xl text-left flex items-center gap-3
                transition-all duration-300 group relative
                ${selectedIndex === index 
                  ? 'bg-blue-500 text-white transform scale-95'
                  : 'hover:bg-blue-50 text-gray-700'
                }
                ${i18n.language === code 
                  ? 'bg-blue-50'
                  : ''
                }
              `}
            >
              <span className="text-xl transform transition-all duration-300 group-hover:scale-125">
                {flag}
              </span>
              <span className={`
                text-sm font-medium transition-all duration-300
                ${selectedIndex === index ? 'text-white' : 'text-gray-700'}
              `}>
                {nativeName}
              </span>
              {i18n.language === code && (
                <span className="absolute right-4 w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}