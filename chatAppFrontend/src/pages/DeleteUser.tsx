import React, { useState } from 'react';
import axios from 'axios';

type Props = {
    setIsDelete : (vale : boolean) => void
}

const DeleteUser: React.FC<Props> = ({setIsDelete}) => {
    const [password, setPassword] = useState('');

    const handleDelete = async(e : React.FormEvent) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("authToken"); // Retrieve the token
            const response = await axios.delete('http://localhost:5000/api/users/delete', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    password: password,
                },
            });
            console.log('User account deleted successfully:', response.data);
            setIsDelete(true)
        } catch (error) {
            console.error('Delete failed:', error);
        }
        
    };

    const handleCancel = () => {
        // Add your cancel logic here
        console.log('Delete cancelled');
        setIsDelete(false)
    };

    return (
        <div className="fixed inset-0 flex font-Inter items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4">Delete User</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={handleCancel}
                        className="bg-indigo-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUser;