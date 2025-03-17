import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import ProfileAvatar from './ProfileAvatar';

interface UserFormProps {
    user?: User;
    onSubmit: (userData: Omit<User, 'id'>) => void;
    onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | ''>('');
    const [birthday, setBirthday] = useState('');
    const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize form with user data if editing
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setGender(user.gender);
            setBirthday(user.birthday);
            setProfilePicture(user.profilePicture);
        }
    }, [user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!firstName || !lastName || !gender || !birthday) {
            alert('Please fill in all required fields.');
            return;
        }

        // Submit the form data
        onSubmit({
            firstName,
            lastName,
            gender: gender as 'Male' | 'Female' | 'Other',
            birthday,
            profilePicture,
        });
    };

    // Real function for profile picture upload
    const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file type
        if (!file.type.match('image.*')) {
            alert('Please select an image file');
            return;
        }

        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setProfilePicture(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Trigger file input click
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // Format date for the input field
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (error) {
            return '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        {profilePicture ? (
                            <div className="w-32 h-32 rounded-full overflow-hidden">
                                <img
                                    src={profilePicture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                            </div>
                        )}
                    </div>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePictureUpload}
                        accept="image/*"
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={triggerFileInput}
                        className="bg-primary text-white px-4 py-2 rounded mb-2 w-full"
                    >
                        Upload Profile Picture
                    </button>
                    {profilePicture && (
                        <button
                            type="button"
                            onClick={() => setProfilePicture(undefined)}
                            className="bg-danger text-white px-4 py-2 rounded w-full"
                        >
                            Delete Picture
                        </button>
                    )}
                </div>

                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Please enter first name"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Please enter last name"
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as any)}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value="">-- Please select Gender --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Birthday</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formatDateForInput(birthday)}
                                    onChange={(e) => setBirthday(e.target.value)}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-cancel text-white px-6 py-2 rounded"
                >
                    CANCEL
                </button>
                <button
                    type="submit"
                    className="bg-success text-white px-6 py-2 rounded"
                >
                    SAVE
                </button>
            </div>
        </form>
    );
};

export default UserForm;
