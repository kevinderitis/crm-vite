import React from 'react';
import { Chat, Tag } from '../types';
import { formatDistanceToNow } from '../utils';
import { ChatOptions } from './ChatOptions';
import { TagBadge } from './TagBadge';

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onAddTag: (chatId: string, tag: Tag) => void;
  onRemoveTag: (chatId: string, tagId: string) => void;
  availableTags: Tag[];
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  onDeleteChat,
  onAddTag,
  onRemoveTag,
  availableTags,
}) => {
  const getLastMessagePreview = (chat: Chat) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (!lastMessage) return '';

    switch (lastMessage.type) {
      case 'text':
        return lastMessage.content;
      case 'image':
        return '📷 Imagen';
      case 'audio':
        return '🎤 Mensaje de voz';
      default:
        return '';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`flex items-center p-3 hover:bg-gray-800 ${
            selectedChatId === chat.id ? 'bg-gray-800' : ''
          }`}
        >
          <div
            className="flex-1 cursor-pointer"
            onClick={() => onSelectChat(chat.id)}
          >
            <div className="flex items-center">
              <img
                src={chat.user.avatar}
                alt={chat.user.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium">{chat.user.name}</h3>
                  <span className="text-xs text-gray-400">
                    {chat.messages.length > 0 &&
                      formatDistanceToNow(
                        new Date(chat.messages[chat.messages.length - 1].timestamp)
                      )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400 truncate max-w-[200px]">
                    {getLastMessagePreview(chat)}
                  </p>
                  {chat.unreadCount > 0 && (
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                {chat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {chat.tags.map((tag) => (
                      <TagBadge key={tag.id} tag={tag} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <ChatOptions
            chat={chat}
            onAddTag={onAddTag}
            onRemoveTag={onRemoveTag}
            onDeleteChat={onDeleteChat}
            availableTags={availableTags}
          />
        </div>
      ))}
    </div>
  );
};