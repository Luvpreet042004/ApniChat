import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSocket } from '../hooks/useSocket';

interface Message {
  id?: number;
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToLatestMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (socket && senderId && receiverId) {
      setMessages([]); // Clear messages when sender or receiver changes

      // Join the chat room
      socket.emit('inchat', Number(senderId), Number(receiverId));

      const fetchMessages = async () => {
        const token = localStorage.getItem("authToken")
        try {
          const response = await axios.get(
            `http://localhost:5000/api/messages/chat/${Math.min(Number(senderId), Number(receiverId))}/${Math.max(
              Number(senderId),
              Number(receiverId)
            )}`,{headers: {
              Authorization: `Bearer ${token}`,
          }}
          );
          if (Array.isArray(response.data)) {
            setMessages(response.data);
            scrollToLatestMessage();
          } else {
            console.error('Invalid message data format:', response.data);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();

      const handleNewMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
        scrollToLatestMessage();
      };

      socket.on('receiveMessage', handleNewMessage);

      return () => {
        socket.off('receiveMessage', handleNewMessage);
      };
    }
  }, [socket, senderId, receiverId]); // Re-run when senderId or receiverId changes

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      content: input,
      senderId: Number(senderId),
      receiverId: Number(receiverId),
    };
    
    scrollToLatestMessage();
    setInput('');

    try {
      socket?.emit('sendMessage', newMessage, (response: { status: string }) => {
        if (response.status !== 'ok') {
          alert('Message failed to send. Please try again.');
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      {/* Message List */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) && messages.map((message, index) => (
          <div
            key={message.id || index}
            className={`p-3 rounded-lg max-w-xs ${
              message.senderId === Number(senderId)
                ? 'bg-blue-500 text-white self-end'
                : 'bg-gray-300 text-black self-start'
            }`}
          >
            {message.content}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Box */}
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
