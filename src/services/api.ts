import axios from 'axios';
import { User } from '../types';

// Base URL for the API
const API_URL = 'http://localhost:3001/api';

// Function to get users with pagination and search
export const getUsers = async (page: number = 1, search: string = '') => {
    try {
        let url = `${API_URL}/users`;

        // If search term is provided, use the name/surname endpoint
        if (search) {
            url = `${API_URL}/users/${search}`;
        }

        const response = await axios.get(url);

        // Map backend response to frontend User type
        const users = response.data.data.map((user: any) => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            gender: user.gender,
            birthday: user.birthDate, // Map birthDate to birthday
            profilePicture: user.image // Map image to profilePicture
        }));

        // Mock pagination since our backend doesn't support it yet
        const ITEMS_PER_PAGE = 10;
        const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

        // Calculate slice for current page
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedUsers = users.slice(startIndex, endIndex);

        return {
            users: paginatedUsers,
            pagination: {
                currentPage: page,
                totalPages: totalPages || 1,
            }
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Function to get a single user by ID
export const getUserById = async (id: string) => {
    try {
        // Our API doesn't have a specific endpoint for getting a user by ID
        // So we'll get all users and filter
        const response = await axios.get(`${API_URL}/users`);
        const backendUser = response.data.data.find((user: any) => user.id === id);

        if (!backendUser) return null;

        // Map backend response to frontend User type
        const user: User = {
            id: backendUser.id,
            firstName: backendUser.firstName,
            lastName: backendUser.lastName,
            gender: backendUser.gender,
            birthday: backendUser.birthDate, // Map birthDate to birthday
            profilePicture: backendUser.image // Map image to profilePicture
        };

        return user;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};

// Function to create a new user
export const createUser = async (userData: Omit<User, 'id'>) => {
    try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('firstName', userData.firstName);
        formData.append('lastName', userData.lastName);
        formData.append('gender', userData.gender);
        formData.append('birthDate', userData.birthday); // Use birthday from frontend for birthDate in backend

        // If profile picture is a base64 string, convert it to a file
        if (userData.profilePicture && typeof userData.profilePicture === 'string') {
            // This is a simplified approach - in a real app you'd need to handle this better
            const response = await fetch(userData.profilePicture);
            const blob = await response.blob();
            const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
            formData.append('image', file);
        }

        const response = await axios.post(`${API_URL}/users`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Map backend response to frontend User type
        const user: User = {
            id: response.data.data.id,
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName,
            gender: response.data.data.gender,
            birthday: response.data.data.birthDate, // Map birthDate to birthday
            profilePicture: response.data.data.image // Map image to profilePicture
        };

        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

// Function to update an existing user
export const updateUser = async (id: string, userData: Partial<User>) => {
    try {
        // Create FormData for file upload
        const formData = new FormData();

        if (userData.firstName) formData.append('firstName', userData.firstName);
        if (userData.lastName) formData.append('lastName', userData.lastName);
        if (userData.gender) formData.append('gender', userData.gender);
        if (userData.birthday) formData.append('birthDate', userData.birthday); // Use birthday from frontend for birthDate in backend

        // If profile picture is a base64 string, convert it to a file
        if (userData.profilePicture && typeof userData.profilePicture === 'string' &&
            userData.profilePicture.startsWith('data:')) {
            // This is a simplified approach - in a real app you'd need to handle this better
            const response = await fetch(userData.profilePicture);
            const blob = await response.blob();
            const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
            formData.append('image', file);
        }

        const response = await axios.put(`${API_URL}/users/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Map backend response to frontend User type
        const user: User = {
            id: response.data.data.id,
            firstName: response.data.data.firstName,
            lastName: response.data.data.lastName,
            gender: response.data.data.gender,
            birthday: response.data.data.birthDate, // Map birthDate to birthday
            profilePicture: response.data.data.image // Map image to profilePicture
        };

        return user;
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
    }
};

// Function to delete a user
export const deleteUser = async (id: string) => {
    try {
        await axios.delete(`${API_URL}/users/${id}`);
        return { success: true };
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};
