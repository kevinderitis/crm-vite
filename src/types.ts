export interface User {
  id: string;
  name: string;
  avatar: string;
  lastSeen: string;
  online: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  received: boolean;
  read: boolean;
  type: 'text' | 'image' | 'audio';
  mediaUrl?: string;
}

export interface Chat {
  id: string;
  user: User;
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
  tags: Tag[];
}

export interface SearchFilters {
  query: string;
  tags: string[];
}