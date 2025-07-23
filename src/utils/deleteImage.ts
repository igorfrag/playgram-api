import fs from 'fs';
import path from 'path';
import { getUploadPath } from './getUploadPath';

export const deleteImage = async (imageUrl: string) => {
    try {
        const { basePath } = getUploadPath();
        const imageFileName = path.basename(imageUrl);
        const fullPath = path.join(basePath, imageFileName);

        const fileExists = await fs.promises
            .stat(fullPath)
            .then(() => true)
            .catch(() => false);
        if (fileExists) {
            await fs.promises.unlink(fullPath);
            console.log(`File Deleted: ${fullPath}`);
        } else {
            console.warn(`File not found: ${fullPath}`);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};
