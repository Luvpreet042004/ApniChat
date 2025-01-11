import React, { useState } from "react";
import axios from "axios";
import { ChatIcon, AddUser, ProfileIcon, SettingsIcon, LogoutIcon, HamburgerMenu } from "./SvgComponents";
import { useIsOpenContext } from "../hooks/useIsOpen";
import { useConnections } from "../hooks/useConnections";

const SideBar: React.FC = () => {
    const {setConnections} = useConnections();
    const { isOpen } = useIsOpenContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [addingUser, setAddingUser] = useState(false);

    // Function to check if the user exists
    const handleCheckUser = async () => {
        setLoading(true);
        setError(null);
        setUserExists(null); // Reset state before checking
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post(
                'http://localhost:5000/api/users/check',
                { email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setUserExists(response.data.exists);
        } catch (err) {
            console.log(err);
            
            setError('Failed to check user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Function to add a new user
    const handleAddUser = async () => {
        setAddingUser(true);
        setError(null);
        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                'http://localhost:5000/api/users/connect',
                { connectionEmail: email },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const response = await axios.get('http://localhost:5000/api/users/connections', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setConnections(response.data.connections); 

            alert('User added successfully!');


            closeModal(); // Reset modal state after successful addition
        } catch (err) {
            console.log(err);
            
            setError('Failed to add user. Please try again.');
        } finally {
            setAddingUser(false);
        }
    };

    // Function to close the modal and reset its state
    const closeModal = () => {
        setIsModalOpen(false);
        setEmail('');
        setUserExists(null);
        setError(null);
    };

    return (
        <div
            className={`flex fixed top-[50px] shadow-sm flex-col lg:justify-between h-[calc(100vh-50px)] bg-[#F4F4F4] transition-all duration-100 p-2 ${
                isOpen ? "lg:w-[210px]" : "lg:w-[60px]"
            }`}
        >
            {/* Sidebar Buttons */}
            <div className="space-y-3 w-full">
                <div>
                    <HamburgerMenu />
                </div>
                <div>
                    <Buttons name="Chat" svg={<ChatIcon />} />
                    <Buttons
                        name="New User"
                        svg={<AddUser />}
                        onClick={() => setIsModalOpen(true)} // Open modal
                    />
                </div>
                <div className="w-[97%] h-[1px] bg-[#DCDCDC]"></div>
            </div>

            {/* Bottom Buttons */}
            <div className="w-full">
                <div className="w-[97%] h-[1px] bg-[#DCDCDC]"></div>
                <Buttons name="Settings" svg={<SettingsIcon />} />
                <Buttons name="Profile" svg={<ProfileIcon />} />
                <Buttons name="Logout" svg={<LogoutIcon />} />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex font-Inter items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-96">
                        <h3 className="text-lg font-Inter font-bold mb-4">Add New User</h3>
                        <input
                            type="email"
                            placeholder="Enter user's email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleCheckUser}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 mb-4 w-full"
                            disabled={loading || email.trim() === ''}
                        >
                            {loading ? 'Checking...' : 'Check User'}
                        </button>
                        {userExists === true && (
                            <div className="text-green-500 font-Inter mb-4">User exists! You can add them.</div>
                        )}
                        {userExists === false && (
                            <div className="text-red-500 mb-4">User does not exist.</div>
                        )}
                        {error && <p className="text-red-500 mb-4">{error}</p>}3
                        {userExists && (
                            <button
                                onClick={handleAddUser}
                                className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 w-full"
                                disabled={addingUser}
                            >
                                {addingUser ? 'Adding...' : 'Add User'}
                            </button>
                        )}
                        <button
                            onClick={closeModal}
                            className="text-gray-500 hover:text-gray-700 mt-2 w-full"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideBar;

interface ComponentProps {
    name: string;
    svg: React.ReactNode;
    onClick?: () => void; // Optional click handler
}

const Buttons: React.FC<ComponentProps> = ({ name, svg, onClick }) => {
    const { isOpen } = useIsOpenContext();

    return (
        <div
            className="flex items-center hover:bg-[#EBEBEB] font-Inter text-md text-black fill-slate-600 space-x-4 p-2 rounded-md cursor-pointer"
            onClick={onClick}
        >
            <div>{svg}</div>
            <div className={`font-light ${isOpen ? "flex" : "hidden"}`}>{name}</div>
        </div>
    );
};
