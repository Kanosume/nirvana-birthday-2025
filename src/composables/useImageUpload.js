import { ref } from 'vue';
import { uploadsAPI } from '../services/api';

export function useImageUpload() {
    const uploadedImage = ref(null);
    const uploadError = ref(null);
    const isUploading = ref(false);

    const uploadImage = async (file) => {
        if (!file) {
            uploadError.value = 'No file selected';
            return null;
        }

        try {
            isUploading.value = true;
            uploadError.value = null;
            const result = await uploadsAPI.uploadImage(file);
            uploadedImage.value = result.url;
            return result;
        } catch (error) {
            console.error('Upload error:', error);
            uploadError.value = error.message || 'Failed to upload image';
            return null;
        } finally {
            isUploading.value = false;
        }
    };

    const resetUpload = () => {
        uploadedImage.value = null;
        uploadError.value = null;
        isUploading.value = false;
    };

    return {
        uploadedImage,
        uploadError,
        isUploading,
        uploadImage,
        resetUpload
    };
}

export default useImageUpload;
