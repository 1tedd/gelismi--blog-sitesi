import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  triggerRect?: DOMRect;
}

export function Modal({ isOpen, onClose, children, triggerRect }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'expanding' | 'full' | 'closing'>('initial');

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
      setAnimationPhase('initial');
      requestAnimationFrame(() => {
        setAnimationPhase('expanding');
        setTimeout(() => setAnimationPhase('full'), 50);
      });
    } else {
      setAnimationPhase('closing');
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTransitionEnd = () => {
    if (animationPhase === 'closing') {
      setIsAnimating(false);
    }
  };

  if (!isOpen && !isAnimating) return null;

  const getInitialStyles = () => {
    if (!triggerRect) return {};

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const scaleX = triggerRect.width / viewportWidth;
    const scaleY = triggerRect.height / viewportHeight;
    const scale = Math.max(scaleX, scaleY);

    const translateX = triggerRect.left + (triggerRect.width / 2) - (viewportWidth / 2);
    const translateY = triggerRect.top + (triggerRect.height / 2) - (viewportHeight / 2);

    const baseStyles = {
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    };

    if (animationPhase === 'initial') {
      return {
        ...baseStyles,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        opacity: 0,
        borderRadius: '12px',
      };
    } else if (animationPhase === 'closing') {
      return {
        ...baseStyles,
        transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
        opacity: 0,
        borderRadius: '12px',
      };
    } else {
      return {
        ...baseStyles,
        transform: 'translate(0, 0) scale(1)',
        opacity: 1,
        borderRadius: '24px',
      };
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500
        ${animationPhase === 'full' ? 'opacity-100' : 'opacity-0'}
      `}
      onTransitionEnd={handleTransitionEnd}
      data-hover
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500
          ${animationPhase === 'full' ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        ref={modalRef}
        className="relative bg-white overflow-hidden w-full max-w-3xl shadow-2xl"
        style={getInitialStyles()}
        data-hover
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 z-10 p-2.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
          data-hover
        >
          <X className="w-5 h-5" />
        </button>
        <div className="modal-content" data-hover>
          {children}
        </div>
      </div>
    </div>
  );
}