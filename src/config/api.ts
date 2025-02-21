export const API_CONFIG = {
    BASE_URL: "http://ec2-3-87-44-69.compute-1.amazonaws.com:8000",
    // BASE_URL: "http://localhost:8000",
    // On ajouter d'autres configurations ici
};

// Helper function pour construire les URLs
export const buildApiUrl = (endpoint: string): string => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};