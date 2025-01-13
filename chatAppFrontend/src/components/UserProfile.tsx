import React from 'react';
// import axios from 'axios';
import SideBar from './SideBar';
import { ConnectionsProvider } from '../context/ConnectionsProvider';
import { IsOpenProvider } from '../context/isOpen';
import Logo from '../assets/Dashboard/image_transparent 1.png';


const UserProfile: React.FC = () => {
  // State management
//   const [newPassword, setNewPassword] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const name = localStorage.getItem('userName')
//   const email = localStorage.getItem('userEmail')

//   useEffect(() => {
    
//   }, []);

//   const handleProfileUpdate = async () => {
//     try {
//       // Send updated name to the backend
//       const response = await axios.put('/api/user/update-profile', { name });
//       if (response.status === 200) {
//         alert('Profile updated successfully');
//         // Update localStorage with new name
//         const user = JSON.parse(localStorage.getItem('user') || '{}');
//         user.name = name;
//         localStorage.setItem('user', JSON.stringify(user));
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('Failed to update profile');
//     }
//   };

//   const handlePasswordChange = async () => {
//     try {
//       // Send current and new password to the backend
//       const response = await axios.put('/api/user/change-password', {
//         currentPassword,
//         newPassword,
//       });
//       if (response.status === 200) {
//         alert('Password changed successfully');
//       }
//     } catch (error) {
//       console.error('Error changing password:', error);
//       alert('Failed to change password');
//     }
//   };

//   const handleAccountDelete = async () => {
//     try {
//       // Send delete request to the backend
//       const response = await axios.delete('/api/user/delete-account');
//       if (response.status === 200) {
//         alert('Account deleted successfully');
//         localStorage.removeItem('user');
//         window.location.href = '/login'; // Redirect to login after account deletion
//       }
//     } catch (error) {
//       console.error('Error deleting account:', error);
//       alert('Failed to delete account');
//     }
//   };

  return (
    <>
    hello
    </>
  );
};

export default UserProfile;
