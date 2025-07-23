import path from 'path';

export const getUploadPath = () => {
    const uploadBasePath = process.env.UPLOAD_BASE_PATH || 'uploads';
    const uploadBaseUrl = process.env.UPLOAD_BASE_URL || '/uploads';

    return {
        basePath: path.resolve(uploadBasePath),
        baseUrl: uploadBaseUrl,
    };
};
