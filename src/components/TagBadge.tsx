import React from 'react';
import { Tag } from '../types';

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  clickable?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, onRemove, clickable }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        clickable ? 'cursor-pointer hover:opacity-80' : ''
      }`}
      style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-80"
        >
          ×
        </button>
      )}
    </span>
  );
};