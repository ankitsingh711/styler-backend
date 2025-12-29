import api from './api';

export const userService = {
    // Get user profile
    getProfile: async () => {
        const response = await api.get('/user/profile');
        return response.data;
    },

    // Upload profile picture
    uploadProfilePicture: async (file) => {
        const formData = new FormData();
        formData.append('profileImage', file);

        const response = await api.post('/user/upload-profile-picture', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
