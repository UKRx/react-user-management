import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import UserList from '../components/UserList';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import { getUsers, deleteUser } from '../services/api';
import { User, PaginationData } from '../types';

const UserListPage: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        currentPage: 1,
        totalPages: 1,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch users when page or search query changes
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const data = await getUsers(pagination.currentPage, searchQuery);
                setUsers(data.users);
                setPagination(data.pagination);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [pagination.currentPage, searchQuery]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    // Handle search
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    // Handle edit user
    const handleEdit = (userId: string) => {
        navigate(`/users/edit/${userId}`);
    };

    // Handle delete user
    const handleDelete = async (userId: string) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                // Refresh the user list
                const data = await getUsers(pagination.currentPage, searchQuery);
                setUsers(data.users);
                setPagination(data.pagination);
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    // Handle add new user
    const handleAddUser = () => {
        navigate('/users/new');
    };

    return (
        <Layout title="Users List">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
                <div className="w-full md:w-1/2 mb-4 md:mb-0">
                    <SearchBar onSearch={handleSearch} />
                </div>
                <button
                    onClick={handleAddUser}
                    className="bg-primary text-white px-4 py-2 rounded"
                >
                    Add +
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : (
                <>
                    <UserList
                        users={users}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </Layout>
    );
};

export default UserListPage;
