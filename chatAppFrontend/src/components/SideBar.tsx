import React from "react";
import { ChatIcon,AddUser,ProfileIcon,SettingsIcon,LogoutIcon, HamburgerMenu } from "./SvgComponents";
import { useIsOpenContext } from "../hooks/useIsOpen";

const SideBar: React.FC = () => {
    const { isOpen } = useIsOpenContext();

    return (
        <div
            className={`flex fixed top-[50px] shadow-sm flex-col lg:justify-between h-[calc(100vh-50px)] bg-[#F4F4F4] transition-all duration-100 p-2 ${
                isOpen ? "lg:w-[210px]" : "lg:w-[60px]"
            }`}
        >
            <div className="space-y-3 w-full">
                <div>
                    <HamburgerMenu />
                </div>
                <div>
                    <Buttons name="Chat" svg={<ChatIcon />} />
                    <Buttons name="New User" svg={<AddUser />} />
                </div>
                <div className="w-[97%] h-[1px] bg-[#DCDCDC]"></div>
            </div>
            <div className="w-full">
                <div className="w-[97%] h-[1px] bg-[#DCDCDC]"></div>
                <Buttons name="Settings" svg={<SettingsIcon />} />
                <Buttons name="Profile" svg={<ProfileIcon />} />
                <Buttons name="Logout" svg={<LogoutIcon />} />
            </div>
        </div>
    );
};


export default SideBar;


interface ComponentProps {
    name: string;
    svg :React.ReactNode;
}

const Buttons: React.FC<ComponentProps> = ({ name, svg }) => {
    const {isOpen} = useIsOpenContext();

    return (
        <div className="flex items-center hover:bg-[#EBEBEB] font-Inter text-md text-black fill-slate-600 space-x-4 p-2 rounded-md">
            <div>{svg}</div>
            <div className= {`font-light ${isOpen?"flex":"hidden"}`} >{name}</div>
        </div>
    );
};