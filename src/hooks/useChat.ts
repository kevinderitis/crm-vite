import { useState, useEffect } from 'react';
import { ChatService } from '../services/api';
import { Chat, Message } from '../types';

export function useChat() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
    setupWebSocket();
  }, []);

  const loadChats = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) throw new Error('No user email found');
      
      const chatData = await ChatService.getUserChats(userEmail);
      setChats(chatData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    const ws = new WebSocket(`ws://${window.location.host}?userEmail=${encodeURIComponent(userEmail)}`);

    ws.onmessage = (event) => {
      const { user, textMessage, destination, image, audioUrl } = JSON.parse(event.data);
      
      if (destination === userEmail) {
        loadChats(); // Reload chats to get the latest messages
      }
    };

    return () => ws.close();
  };

  const sendMessage = async (userId: string, content: string) => {
    try {
      await ChatService.sendMessage(userId, content);
      await loadChats(); // Reload chats to get the latest messages
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const deleteChat = async (userId: string) => {
    try {
      await ChatService.deleteChat(userId);
      await loadChats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete chat');
    }
  };

  const addTag = async (userId: string, tag: string) => {
    try {
      await ChatService.addTag(userId, tag);
      await loadChats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tag');
    }
  };

  const removeTag = async (userId: string, tag: string) => {
    try {
      await ChatService.removeTag(userId, tag);
      await loadChats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove tag');
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