import React from 'react';
import { useNavigate } from 'react-router-dom';

type User = {
    id: number;
    name: string;
    email: string;
};

type ConnectionsListProps = {
    users: User[];
};

const ConnectionsList: React.FC<ConnectionsListProps> = ({ users }) => {
    const navigate = useNavigate();

    const chatOpener = (user: User) => {
        console.log(`Opening chat with user: ${user.name} (ID: ${user.id})`);
        // Add logic here to open the chat, update the URL, or notify the backen
        const smaller= Math.min(user.id,Number(localStorage.getItem('userId')));
        const larger = Math.max(user.id,Number(localStorage.getItem('userId')));

        navigate(`/chat/${smaller}/${larger}`);
    };

    return (
        <ul className="flex-grow overflow-y-auto space-y-2">
            {users.length > 0 ? (
                users.map((user) => (
                    <li
                        key={user.id}
                        onClick={() => chatOpener(user)} // Pass the user to the handler
                        className="p-2 bg-gray-100 font-Inter rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        {user.name}
                    </li>
                ))
            ) : (
                <li className="text-gray-500">No users found</li>
            )}
        </ul>
    );
};

export default ConnectionsList;
