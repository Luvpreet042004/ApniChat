import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';

interface Message {
    id?: number
  content: string;
  senderId: number;
  receiverId: number;
}

const ChatComponent: React.FC = () => {
  const { socket } = useSocket();
  const { smaller, larger } = useParams<{ smaller: string; larger: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const senderId = localStorage.getItem('userId');
  const receiverId = senderId === smaller ? larger : smaller;

  useEffect(() => {
    if (socket && senderId && receiverId) {
      socket.emit('inchat', Number(senderId), Number(receiverId));

      // Listen for new messages
      socket.on('newMessage', (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      // Cleanup on unmount
      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, senderId, receiverId]);


  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      content: input,
      senderId: Number(senderId),
      receiverId: Number(receiverId),
    };

    // Emit the message to the server
    if (socket) {
      socket.emit('sendMessage', newMessage);
    }

    // Append the message locally (optimistic update)
    setInput('');
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id || index} // Use index as a fallback if ID is missing
            className={`p-3 rounded-lg max-w-xs ${
              message.senderId === Number(senderId)
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-300 text-black self-start'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-300 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
