// import React, { useState, useEffect } from "react";
// import { useSocket } from "../context/useSocket";

// interface Message {
//   senderId: string;
//   receiverId: string;
//   content: string;
// }

// const Chat: React.FC = () => {
//   const { socket } = useSocket();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");

//   // Listen for incoming messages
//   useEffect(() => {
//     if (!socket) return;

//     socket.on("receiveMessage", (message: Message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, [socket]);

//   // Send a message
//   const sendMessage = () => {
//     if (!socket) return;

//     const message: Message = {
//       senderId: "1", // Replace with the actual sender ID
//       receiverId: "2", // Replace with the actual receiver ID
//       content: input,
//     };

//     socket.emit("sendMessage", message);
//     setMessages((prevMessages) => [...prevMessages, message]);
//     setInput("");
//   };

//   return (
//     <div>
//       <div>
//         <h2>Messages</h2>
//         <ul>
//           {messages.map((msg, index) => (
//             <li key={index}>
//               <strong>{msg.senderId}:</strong> {msg.content}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div>
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message..."
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default Chat;

import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const Chat : React.FC = () => {
  const [input, setInput] = React.useState<string>("");

  const socket = io('http://localhost:5000');

  useEffect(() => {
    socket.on('connect', () => {
      console.log("Connected to the server");
    })

    socket.on('inchat', () => {
      console.log("User joined their room");
    });

    return () => {
      socket.disconnect();
    }
  },[]);

  return (
    <div>
      <input type="text" onChange={e =>setInput(e.target.value)} placeholder="Type your message..." />
      <button onClick={()=>{socket.emit("sendMessage",input)}}> Send </button>
    </div>
  );
};

export default Chat;