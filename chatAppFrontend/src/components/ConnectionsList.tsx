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
    
        const smaller = Math.min(user.id, Number(localStorage.getItem('userId')));
        const larger = Math.max(user.id, Number(localStorage.getItem('userId')));
    
        // Navigate to the correct route
        navigate(`/dashboard/friend/chat/${smaller}/${larger}`);
    };
    

    return (
        <div className="h-full overflow-y-auto scrollbar-none space-y-2">
            {users.length > 0 ? (
                users.map((user) => (
                    <div
                        key={user.id}
                        onClick={() => chatOpener(user)} // Pass the user to the handler
                        className="p-2 bg-gray-100 font-Inter rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        {user.name}
                    </div>
                ))
            ) : (
                <li className="text-gray-500">No users found</li>
            )}
        </div>
    );
};

export default ConnectionsList;
