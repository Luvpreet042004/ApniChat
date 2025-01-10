import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ChatSection from './ChatSection';
// import ChatSection from './ChatSection';

type User = {
    id: number;
    name: string;
    email: string;
}

type Users = User[];

const UserSection: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<Users>([]);  // Type the state as Users
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);  // Added error state for handling errors

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const token = localStorage.getItem('authToken');
                setLoading(true);
                const response = await axios.get('http://localhost:5000/api/users/connections',{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data.connections);  // Response data is expected to be of type Users
            } catch (error) {
                setError('Failed to load users');
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchConnections();
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-full">
        <div className="flex flex-col h-full bg-white rounded-md shadow-md p-4 overflow-hidden">
            <h2 className="text-xl font-Inter font-bold">Chats</h2>
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
                <ul className="flex-grow overflow-y-auto space-y-2">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <li
                                key={user.id}
                                className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                {user.name}
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-500">No users found</li>
                    )}
                </ul>
            )}
        </div>
        <div> <ChatSection /></div>
        </div>
    );
};

export default UserSection;

