import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import ConnectionsList from './ConnectionsList';
import { useConnections } from '../hooks/useConnections';
import ChatComponent from './ChatSection'

const UserSection: React.FC = () => {
    const { connections, setConnections } = useConnections();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

  console.log('in usersection');
  
    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const token = localStorage.getItem('authToken');
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/users/connections', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setConnections(response.data.connections);
            } catch (error) {
                setError('Failed to load users');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();

        


    }, [setConnections]);

    // Filtered users based on search term
    const filteredUsers = searchTerm
        ? connections.filter((user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : connections;

    return (
        <div className="grid grid-cols-3 h-full w-full">
  {/* Chats Sidebar */}
  <div className="col-span-1 flex flex-col bg-white rounded-md shadow-md p-4 overflow-hidden">
    <h2 className="text-xl font-bold mb-4">Chats</h2>
    <input
      type="text"
      placeholder="Search users..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {loading ? (
      <p className="text-gray-500">Loading...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : (
      // Render filtered users or all users
      <div className="overflow-y-auto h-full">
        <ConnectionsList users={filteredUsers} />
      </div>
    )}
  </div>

  {/* Chat Section */}
  <div className="col-span-2 z-0 flex justify-center items-center bg-gray-100 rounded-md shadow-md">
  <Routes>
      <Route path="/" element={<div>Select Friend to start chat....</div>} />
      <Route path="chat/:smaller/:larger" element={<ChatComponent />} />
    </Routes>
  </div>
</div>

    );
};

export default UserSection;
