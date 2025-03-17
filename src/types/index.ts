export interface User {
    id: string;
    firstName: string;
    lastName: string;
    gender: 'Male' | 'Female' | 'Other';
    birthday: string;
    profilePicture?: string;
}

export interface PaginationData {
    currentPage: number;
    totalPages: number;
}
