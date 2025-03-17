import React from 'react';
import { format } from 'date-fns';
import { User } from '../types';
import ProfileAvatar from './ProfileAvatar';

interface UserListProps {
    users: User[];
    onEdit: (userId: string) => void;
    onDelete: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return format(date, 'dd MMM yyyy');
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-secondary">
                    <tr>
                        <th className="py-3 px-4 text-left">Profile picture</th>
                        <th className="py-3 px-4 text-left">First name</th>
                        <th className="py-3 px-4 text-left">Last name</th>
                        <th className="py-3 px-4 text-left">Gender</th>
                        <th className="py-3 px-4 text-left">Birthday</th>
                        <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                                <ProfileAvatar letter={user.firstName[0]} image={user.profilePicture} />
                            </td>
                            <td className="py-3 px-4">{user.firstName}</td>
                            <td className="py-3 px-4 text-red-500 underline">{user.lastName}</td>
                            <td className="py-3 px-4">{user.gender}</td>
                            <td className="py-3 px-4">{formatDate(user.birthday)}</td>
                            <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEdit(user.id)}
                                        className="bg-warning text-white px-4 py-1 rounded"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(user.id)}
                                        className="bg-danger text-white px-4 py-1 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
