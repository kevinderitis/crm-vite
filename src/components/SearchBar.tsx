import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Tag } from '../types';
import { TagBadge } from './TagBadge';

interface SearchBarProps {
  query: string;
  selectedTags: Tag[];
  onQueryChange: (query: string) => void;
  onTagSelect: (tag: Tag) => void;
  onTagRemove: (tagId: string) => void;
  availableTags: Tag[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  selectedTags,
  onQueryChange,
  onTagSelect,
  onTagRemove,
  availableTags,
}) => {
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  return (
    <div className="p-4 bg-gray-800">
      <div className="relative">
        <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar conversaciones"
            className="flex-1 ml-2 bg-transparent text-white outline-none"
          />
          <button
            onClick={() => setShowTagDropdown(!showTagDropdown)}
            className="ml-2 text-gray-400 hover:text-white"
          >
            #
          </button>
        </div>
        
        {showTagDropdown && (
          <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-lg shadow-lg py-1">
            {availableTags.map((tag) => (
              <div
                key={tag.id}
                onClick={() => {
                  onTagSelect(tag);
                  setShowTagDropdown(false);
                }}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                <TagBadge tag={tag} />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedTags.map((tag) => (
            <TagBadge
              key={tag.id}
              tag={tag}
              onRemove={() => onTagRemove(tag.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};