import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Tag, Trash2 } from 'lucide-react';
import { Chat, Tag as TagType } from '../types';
import { TagBadge } from './TagBadge';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface ChatOptionsProps {
  chat: Chat;
  onAddTag: (chatId: string, tag: TagType) => void;
  onRemoveTag: (chatId: string, tagId: string) => void;
  onDeleteChat: (chatId: string) => void;
  availableTags: TagType[];
}

export const ChatOptions: React.FC<ChatOptionsProps> = ({
  chat,
  onAddTag,
  onRemoveTag,
  onDeleteChat,
  availableTags,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false);
        setShowTagSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (tag: TagType) => {
    onAddTag(chat.id, tag);
    setShowTagSelector(false);
    setShowOptions(false);
  };

  const handleRemoveTag = (tagId: string) => {
    onRemoveTag(chat.id, tagId);
  };

  const handleDelete = () => {
    onDeleteChat(chat.id);
    setShowDeleteModal(false);
    setShowOptions(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowOptions(!showOptions);
          if (!showOptions) {
            setShowTagSelector(false);
          }
        }}
        className="p-1 hover:bg-gray-700 rounded-full"
      >
        <MoreVertical size={20} className="text-gray-400" />
      </button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTagSelector(!showTagSelector);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              <Tag size={16} className="mr-2" />
              Gestionar etiquetas
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(true);
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
            >
              <Trash2 size={16} className="mr-2" />
              Eliminar conversación
            </button>
          </div>
        </div>
      )}

      {showTagSelector && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg z-10">
          <div className="p-4">
            <h3 className="text-white font-medium mb-2">Etiquetas</h3>
            <div className="space-y-2">
              {chat.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {chat.tags.map((tag) => (
                    <TagBadge
                      key={tag.id}
                      tag={tag}
                      onRemove={() => handleRemoveTag(tag.id)}
                    />
                  ))}
                </div>
              )}
              <div className="border-t border-gray-700 pt-2">
                <h4 className="text-sm text-gray-400 mb-2">Agregar etiqueta</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter((tag) => !chat.tags.find((t) => t.id === tag.id))
                    .map((tag) => (
                      <div
                        key={tag.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddTag(tag);
                        }}
                        className="cursor-pointer"
                      >
                        <TagBadge tag={tag} clickable />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          userName={chat.user.name}
        />
      )}
    </div>
  );
};