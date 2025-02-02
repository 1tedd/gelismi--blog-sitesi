import React, { useEffect, useState, useRef } from 'react';

interface SkillChartProps {
  name: string;
  percentage: number;
  color: string;
  triggerAnimation: boolean;
}

export function SkillChart({ name, percentage, color, triggerAnimation }: SkillChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const [strokeDashoffset, setStrokeDashoffset] = useState(circumference);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (circleRef.current) {
      observer.observe(circleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && triggerAnimation) {
      const timer = setTimeout(() => {
        setStrokeDashoffset(circumference - (percentage / 100) * circumference);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, triggerAnimation, percentage, circumference]);

  return (
    <div id={`skill-${name}`} className="flex flex-col items-center">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle
            className="text-gray-200"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="48"
            cy="48"
          />
          <circle
            ref={circleRef}
            className="transition-all duration-1000 ease-out"
            strokeWidth="8"
            stroke={color}
            fill="transparent"
            r={radius}
            cx="48"
            cy="48"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: isVisible ? strokeDashoffset : circumference,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold" style={{ color }}>
            {isVisible ? `${percentage}%` : '0%'}
          </span>
        </div>
      </div>
      <span className="mt-2 font-medium text-gray-700">{name}</span>
    </div>
  );
}