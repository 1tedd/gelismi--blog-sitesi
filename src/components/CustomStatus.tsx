import React, { useState, useEffect } from 'react';
import { Smile, Edit2, Check } from 'lucide-react';

interface CustomStatusProps {
  status: string | null;
  onStatusChange: (status: string) => void;
  customActivity?: {
    state: string;
    emoji?: {
      name: string;
      id: string | null;
      animated: boolean;
    };
  };
}

export function CustomStatus({ status, onStatusChange, customActivity }: CustomStatusProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState(status || '');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (customActivity?.state) {
      setEditedStatus(customActivity.state);
      onStatusChange(customActivity.state);
    }
  }, [customActivity, onStatusChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStatusChange(editedStatus);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="relative inline-flex items-center">
        <input
          type="text"
          value={editedStatus}
          onChange={(e) => setEditedStatus(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-600 w-72"
          placeholder="Set your status..."
          autoFocus
        />
        <button
          type="submit"
          className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Check className="w-5 h-5 text-green-500" />
        </button>
      </form>
    );
  }

  return (
    <div
      className="relative inline-flex items-center group bg-white/50 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm hover:bg-white/80 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-2 text-gray-700">
        {customActivity?.emoji?.id ? (
          <img
            src={`https://cdn.discordapp.com/emojis/${customActivity.emoji.id}.${
              customActivity.emoji.animated ? 'gif' : 'png'
            }`}
            alt={customActivity.emoji.name}
            className="w-5 h-5"
          />
        ) : (
          <Smile className="w-5 h-5" />
        )}
        <span className="font-medium">
          {editedStatus || 'Set a status'}
        </span>
      </div>
      <button
        onClick={() => setIsEditing(true)}
        className={`ml-2 p-1 rounded-full transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        } hover:bg-gray-100`}
      >
        <Edit2 className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}