import { API_URL } from '../config';

export const getPetImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    // If it's already a full URL
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // If it's a client-side public asset (starts with /images/)
    if (imagePath.startsWith('/images/')) {
        return imagePath;
    }
    
    // If it's a server upload (should be relative to /uploads/)
    // We use the centralized API_URL
    const baseUrl = API_URL;
    
    // If the path already starts with 'uploads/', don't double it
    if (imagePath.startsWith('uploads/')) {
        return `${baseUrl}/${imagePath}`;
    }
    
    return `${baseUrl}/uploads/${imagePath}`;
};
