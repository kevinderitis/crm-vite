import { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import { Chat, Message, Tag } from '../types';

export function useApi() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
    setupWebSocket();

    return () => {
      ApiService.disconnectWebSocket();
    };
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const fetchedChats = await ApiService.getChats();
      setChats(fetchedChats);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading chats');
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    ApiService.connectWebSocket((message: Message) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === message.chatId
            ? {
                ...chat,
                messages: [...chat.messages, message],
                unreadCount: chat.unreadCount + 1,
              }
            : chat
        )
      );
    });
  };

  const sendMessage = async (chatId: string, content: string, type: 'text' | 'image' | 'audio', mediaUrl?: string) => {
    try {
      const message = await ApiService.sendMessage(chatId, {
        content,
        type,
        mediaUrl,
        timestamp: new Date().toISOString(),
        senderId: 'me',
        received: true,
        read: false,
      });

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, message],
              }
            : chat
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending message');
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      await ApiService.deleteChat(chatId);
      setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting chat');
    }
  };

  const addTag = async (chatId: string, tag: Tag) => {
    try {
      await ApiService.addTagToChat(chatId, tag.id);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? { ...chat, tags: [...chat.tags, tag] }
            : chat
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error adding tag');
    }
  };

  const removeTag = async (chatId: string, tagId: string) => {
    try {
      await ApiService.removeTagFromChat(chatId, tagId);
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === chatId
            ? { ...chat, tags: chat.tags.filter((tag) => tag.id !== tagId) }
            : chat
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error removing tag');
    }
  };

  return {
    chats,
    loading,
    error,
    sendMessage,
    deleteChat,
    addTag,
    removeTag,
  };
}