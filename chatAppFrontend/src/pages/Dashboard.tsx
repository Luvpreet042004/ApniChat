import React from "react";
import SideBar from "../components/SideBar";
import { IsOpenProvider } from "../context/isOpen";
import Logo from '../assets/Dashboard/image_transparent 1.png';
import ChatSection from "../components/UserSection";
import {io} from 'socket.io-client';

const Dashboard: React.FC = () => {
    const socket = io("http://localhost:5000/api/users/dashboard");
    return (
        <IsOpenProvider>
            <div className="bg-[#F4F4F4]">
                <div className="h-[50px] w-screen fixed top-0 flex items-center text-black font-Inter justify-start px-4 bg-[#F4F4F4] font-normal shadow-sm">
                    <img src={Logo} className="w-[40px]" alt="" />ChatVerse
                </div>

                <div className="flex h-screen pt-[50px]">
                    <SideBar />
                    <div className="ml-[60px] flex-grow rounded-md">
                        <ChatSection />
                    </div>
                </div>
            </div>
        </IsOpenProvider>
    );
};

export default Dashboard;
