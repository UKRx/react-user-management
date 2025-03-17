import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import UserForm from '../components/UserForm';
import { getUserById, createUser, updateUser } from '../services/api';
import { User } from '../types';

const UserFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(id ? true : false);

    // Fetch user data if editing
    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                try {
                    setLoading(true);
                    const userData = await getUserById(id);
                    setUser(userData as any);
                } catch (error) {
                    console.error('Error fetching user:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (userData: Omit<User, 'id'>) => {
        try {
            if (id) {
                // Update existing user
                await updateUser(id, userData);
            } else {
                // Create new user
                await createUser(userData);
            }

            // Redirect to user list
            navigate('/');
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        navigate('/');
    };

    return (
        <Layout title={id ? 'Edit User' : 'Create new User'}>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <UserForm
                    user={user}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            )}
        </Layout>
    );
};

export default UserFormPage;
