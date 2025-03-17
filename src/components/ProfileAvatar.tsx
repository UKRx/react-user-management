import React from 'react';

interface ProfileAvatarProps {
    letter?: string;
    image?: string; // Base64 string or image URL
    size?: 'sm' | 'md' | 'lg';
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ letter, image, size = 'md' }) => {
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-12 h-12 text-lg',
        lg: 'w-32 h-32 text-4xl',
    };

    // If image is provided, display the image
    if (image) {
        return (
            <div className={`${sizeClasses[size]} rounded-full overflow-hidden`}>
                <img
                    src={image}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    // Otherwise display the letter
    return (
        <div
            className={`${sizeClasses[size]} rounded-full bg-primary text-white flex items-center justify-center font-bold`}
        >
            {letter}
        </div>
    );
};

export default ProfileAvatar;
