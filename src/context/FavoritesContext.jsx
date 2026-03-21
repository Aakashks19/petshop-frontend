import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (product) => {
        setFavorites(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.filter(item => item._id !== product._id);
            }
            return [...prev, product];
        });
    };

    const isFavorite = (id) => {
        return favorites.some(item => item._id === id);
    };

    const removeFavorite = (id) => {
        setFavorites(prev => prev.filter(item => item._id !== id));
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, removeFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
