import { Chat, Message, User, Tag } from './types';

export const mockTags: Tag[] = [
  { id: '1', name: 'Trabajo', color: '#FF5733' },
  { id: '2', name: 'Familia', color: '#33FF57' },
  { id: '3', name: 'Amigos', color: '#3357FF' },
  { id: '4', name: 'Importante', color: '#FF33F5' },
  { id: '5', name: 'Proyecto', color: '#33FFF5' },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Elena Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    lastSeen: '2024-03-15T10:30:00',
    online: true,
  },
  {
    id: '2',
    name: 'Carlos Martinez',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    lastSeen: '2024-03-15T09:45:00',
    online: false,
  },
  {
    id: '3',
    name: 'Ana Silva',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    lastSeen: '2024-03-15T11:00:00',
    online: true,
  },
  {
    id: '4',
    name: 'Miguel Torres',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    lastSeen: '2024-03-15T11:30:00',
    online: true,
  },
  {
    id: '5',
    name: 'Laura Pérez',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    lastSeen: '2024-03-15T10:15:00',
    online: false,
  },
  {
    id: '6',
    name: 'Diego Sánchez',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
    lastSeen: '2024-03-15T09:00:00',
    online: true,
  },
];

const createMessage = (
  id: string,
  content: string,
  senderId: string,
  timestamp: string,
  type: 'text' | 'image' | 'audio' = 'text',
  mediaUrl?: string,
  received = true,
  read = true
): Message => ({
  id,
  type,
  content,
  mediaUrl,
  senderId,
  timestamp,
  received,
  read,
});

export const mockChats: Chat[] = [
  {
    id: '1',
    user: mockUsers[0],
    unreadCount: 2,
    tags: [mockTags[0], mockTags[3]],
    messages: [
      createMessage('1', '¡Hola! ¿Cómo estás?', '1', '2024-03-15T10:00:00'),
      createMessage('2', 'Todo bien, gracias 😊', 'me', '2024-03-15T10:01:00'),
      createMessage(
        '3',
        'Mira esta foto de mi viaje',
        '1',
        '2024-03-15T10:02:00',
        'image',
        'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba'
      ),
      createMessage('4', '¿Te gusta el lugar?', '1', '2024-03-15T10:03:00', 'text', undefined, true, false),
    ],
  },
  {
    id: '2',
    user: mockUsers[1],
    unreadCount: 0,
    tags: [mockTags[2]],
    messages: [
      createMessage('5', 'Hey, ¿viste el partido?', '2', '2024-03-15T09:30:00'),
      createMessage('6', '¡Sí! Increíble juego', 'me', '2024-03-15T09:31:00'),
    ],
  },
  {
    id: '3',
    user: mockUsers[2],
    unreadCount: 1,
    tags: [mockTags[0], mockTags[4]],
    messages: [
      createMessage('7', '¿Reunión a las 3?', '3', '2024-03-15T08:00:00'),
      createMessage('8', 'Perfecto', 'me', '2024-03-15T08:01:00'),
      createMessage('9', 'Te envío la agenda', '3', '2024-03-15T08:02:00', 'text', undefined, true, false),
    ],
  },
  {
    id: '4',
    user: mockUsers[3],
    unreadCount: 0,
    tags: [mockTags[1]],
    messages: [
      createMessage('10', '¿Cena familiar el domingo?', '4', '2024-03-15T07:00:00'),
      createMessage('11', 'Claro, ¡ahí estaré!', 'me', '2024-03-15T07:01:00'),
      createMessage(
        '12',
        'El restaurante',
        '4',
        '2024-03-15T07:02:00',
        'image',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4'
      ),
    ],
  },
  {
    id: '5',
    user: mockUsers[4],
    unreadCount: 3,
    tags: [mockTags[4]],
    messages: [
      createMessage('13', 'Necesito el informe', '5', '2024-03-15T06:00:00'),
      createMessage('14', 'Lo envío en una hora', 'me', '2024-03-15T06:01:00'),
    ],
  },
  {
    id: '6',
    user: mockUsers[5],
    unreadCount: 0,
    tags: [mockTags[2], mockTags[3]],
    messages: [
      createMessage('15', '¿Planes para el fin de semana?', '6', '2024-03-15T05:00:00'),
      createMessage('16', 'Aún nada confirmado', 'me', '2024-03-15T05:01:00'),
    ],
  },
];