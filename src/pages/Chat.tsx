import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../hooks/useChat';
import { ChatList } from '../components/ChatList';
import { ChatWindow } from '../components/ChatWindow';
import { SearchBar } from '../components/SearchBar';
import { Tag } from '../types';

export const Chat: React.FC = () => {
  const { logout } = useAuth();
  const { chats, loading, error, sendMessage, deleteChat, addTag, removeTag } = useChat();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    query: '',
    tags: [] as string[],
  });

  const selectedChat = chats.find((chat) => chat.id === selectedChatId);

  const filteredChats = chats.filter((chat) => {
    const matchesQuery = chat.user.name
      .toLowerCase()
      .includes(searchFilters.query.toLowerCase());
    const matchesTags =
      searchFilters.tags.length === 0 ||
      searchFilters.tags.every((tagId) =>
        chat.tags.some((tag) => tag.id === tagId)
      );
    return matchesQuery && matchesTags;
  });

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Cargando chats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col h-screen">
        <header className="bg-gray-800 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-white text-xl font-bold">Chat App</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Cerrar sesión
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            <div className="w-1/3 border-r border-gray-700 flex flex-col">
              <SearchBar
                query={searchFilters.query}
                selectedTags={chats[0]?.tags.filter((tag) =>
                  searchFilters.tags.includes(tag.id)
                ) || []}
                onQueryChange={(query) =>
                  setSearchFilters((prev) => ({ ...prev, query }))
                }
                onTagSelect={(tag: Tag) =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    tags: [...prev.tags, tag.id],
                  }))
                }
                onTagRemove={(tagId: string) =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    tags: prev.tags.filter((id) => id !== tagId),
                  }))
                }
                availableTags={chats[0]?.tags || []}
              />
              <ChatList
                chats={filteredChats}
                selectedChatId={selectedChatId}
                onSelectChat={handleSelectChat}
                onDeleteChat={deleteChat}
                onAddTag={addTag}
                onRemoveTag={removeTag}
                availableTags={chats[0]?.tags || []}
              />
            </div>
            <div className="flex-1">
              {selectedChat ? (
                <ChatWindow
                  chat={selectedChat}
                  onSendMessage={(content, type, mediaUrl) =>
                    sendMessage(selectedChat.id, content)
                  }
                />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <p>Selecciona un chat para comenzar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};