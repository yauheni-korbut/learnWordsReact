// Override with REACT_APP_API_URL for local or preview environments. Keep the
// deployed backend as the default so production builds never target localhost.
export const apiUrl = process.env.REACT_APP_API_URL || 'https://philosophical-ethelind-yauheni.koyeb.app/api';
