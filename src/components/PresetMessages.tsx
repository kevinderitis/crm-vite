import React, { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';

interface PresetMessagesProps {
  onSelect: (message: string) => void;
}

const PRESET_MESSAGES = [
  '👋 ¡Hola! ¿Cómo estás?',
  '✅ De acuerdo',
  '⏰ Dame un momento, por favor',
  '🤝 Gracias por tu tiempo',
  '📅 ¿Podemos agendar una reunión?',
  '👍 Perfecto',
  '❌ Lo siento, no estoy disponible',
  '🎉 ¡Felicitaciones!',
];

export const PresetMessages: React.FC<PresetMessagesProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 ${
          isOpen ? 'text-blue-500' : 'text-gray-400 hover:text-white'
        } focus:outline-none`}
      >
        <MessageSquarePlus size={20} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-64 bg-gray-800 rounded-lg shadow-lg p-2 z-10">
          <div className="grid grid-cols-2 gap-2">
            {PRESET_MESSAGES.map((message, index) => (
              <button
                key={index}
                onClick={() => {
                  onSelect(message);
                  setIsOpen(false);
                }}
                className="text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-lg truncate"
              >
                {message}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};