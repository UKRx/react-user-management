import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-primary text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <div className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center font-bold">
                        D
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4">
                        <h2 className="text-xl text-gray-600">{title}</h2>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
