import React, { useState } from 'react';

const Dashboard1: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const users = ['Alice', 'Bob', 'Charlie', 'David'];

    const filteredUsers = users.filter(user =>
        user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen">
            <div className="w-1/4 bg-gray-100 p-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <ul>
                    {filteredUsers.map(user => (
                        <li
                            key={user}
                            onClick={() => setSelectedUser(user)}
                            className={`p-2 cursor-pointer ${selectedUser === user ? 'bg-blue-500 text-white' : 'bg-white'}`}
                        >
                            {user}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-3/4 bg-white p-4">
                {selectedUser ? (
                    <div>
                        <h2 className="text-2xl mb-4">Chat with {selectedUser}</h2>
                        <div className="h-96 border border-gray-300 p-4 mb-4 overflow-y-scroll">
                            {/* Chat messages will go here */}
                        </div>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a user to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard1;