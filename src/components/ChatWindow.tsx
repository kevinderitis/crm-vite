import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Mic } from 'lucide-react';
import { Chat, Message, MessageType } from '../types';
import { formatDistanceToNow } from '../utils';
import { PresetMessages } from './PresetMessages';

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (content: string, type: MessageType, mediaUrl?: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, 'text');
      setMessage('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSendMessage(file.name, 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const reader = new FileReader();
        reader.onloadend = () => {
          onSendMessage('Audio message', 'audio', reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handlePresetMessage = (presetMessage: string) => {
    onSendMessage(presetMessage, 'text');
  };

  const renderMessage = (msg: Message) => {
    const isMine = msg.senderId === 'me';

    return (
      <div
        key={msg.id}
        className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[70%] rounded-lg px-4 py-2 ${
            isMine
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-700 text-white rounded-bl-none'
          }`}
        >
          {msg.type === 'text' && <p>{msg.content}</p>}
          {msg.type === 'image' && msg.mediaUrl && (
            <img
              src={msg.mediaUrl}
              alt={msg.content}
              className="rounded-lg max-w-full h-auto"
            />
          )}
          {msg.type === 'audio' && msg.mediaUrl && (
            <audio controls className="max-w-full">
              <source src={msg.mediaUrl} type="audio/wav" />
              Tu navegador no soporta el elemento de audio.
            </audio>
          )}
          <div
            className={`text-xs mt-1 ${
              isMine ? 'text-blue-200' : 'text-gray-400'
            }`}
          >
            {formatDistanceToNow(new Date(msg.timestamp))}
            {isMine && (
              <span className="ml-2">
                {msg.read ? '✓✓' : msg.received ? '✓' : ''}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center">
          <img
            src={chat.user.avatar}
            alt={chat.user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-white">{chat.user.name}</h2>
            <p className="text-sm text-gray-400">
              {chat.user.online ? 'En línea' : 'Último acceso ' + chat.user.lastSeen}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {chat.messages.map(renderMessage)}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-white focus:outline-none"
          >
            <Image size={20} />
          </button>
          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            className={`p-2 focus:outline-none ${
              isRecording ? 'text-red-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mic size={20} />
          </button>
          <PresetMessages onSelect={handlePresetMessage} />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};