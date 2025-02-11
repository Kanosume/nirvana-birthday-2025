import axios from 'axios';

const API_BASE_URL = '/api';

export const uploadsAPI = {
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const response = await axios.post(`${API_BASE_URL}/uploadImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });

      return response.data;
    } catch (error) {
      console.error('⚠️ Error uploading image:', error.response?.status, error.response?.data);
      throw error;
    }
  },
};

export const wishesAPI = {
  getAllWishes: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/wishes`);
      return response.data;
    } catch (error) {
      console.error('🚨 Error fetching wishes:', error);
      throw new Error('Failed to load wishes. Please try again later.');
    }
  },

  getById: async (id) => {  // <-- Add this function
    try {
      const response = await axios.get(`${API_BASE_URL}/wishes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching wish with ID ${id}:`, error);
      throw new Error('Failed to load wish. Please try again later.');
    }
  },

  deleteWish: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/wishes/${id}`);
    } catch (error) {
      console.error('🚀 Error deleting wish:', error);
      throw error;
    }
  },
};

export async function submitWish(formData) {
  try {
    let imageUrl = null;
    
    // Handle file upload first if exists
    const fanartFile = formData.get('fanart');
    if (fanartFile && fanartFile.size > 0) {
      console.log('Uploading fanart:', {
        name: fanartFile.name,
        size: fanartFile.size,
        type: fanartFile.type
      });
      
      const uploadResult = await uploadsAPI.uploadImage(fanartFile);
      console.log('Upload result:', uploadResult);
      
      if (uploadResult.success && uploadResult.url) {
        imageUrl = uploadResult.url;
        console.log('Image uploaded successfully:', imageUrl);
      }
    }

    // Prepare wish data with explicit URL handling
    const wishData = {
      name: formData.get('name'),
      message: formData.get('message'),
      twitter: formData.get('twitter') || null,
      fanart: imageUrl // Set URL explicitly
    };

    // Add defensive logging
    console.log('Submitting wish data:', {
      ...wishData,
      fanartPresent: !!imageUrl,
      fanartUrl: imageUrl
    });

    // Create a local reference to imageUrl for closure
    const submittedImageUrl = imageUrl;

    const response = await axios.post(`${API_BASE_URL}/wishes`, wishData, {
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => {
        // Ensure fanart URL is preserved in the request
        const requestData = { ...data };
        if (submittedImageUrl) {
          requestData.fanart = submittedImageUrl;
        }
        console.log('Transform request:', requestData);
        return JSON.stringify(requestData);
      }],
      transformResponse: [(data) => {
        try {
          const parsed = JSON.parse(data);
          // Preserve the fanart URL in the response
          if (parsed.success && parsed.wish) {
            parsed.wish.fanart = parsed.wish.fanart || submittedImageUrl;
            
            console.log('Transform response:', {
              originalFanart: parsed.wish.fanart,
              submittedImageUrl: submittedImageUrl,
              finalFanart: parsed.wish.fanart
            });
          }
          return parsed;
        } catch (error) {
          console.error('Transform response error:', error);
          return JSON.parse(data);
        }
      }]
    });

    if (!response.data.success) {
      throw new Error('Wish submission failed');
    }

    // Final response check and URL preservation
    if (response.data.wish) {
      response.data.wish.fanart = response.data.wish.fanart || submittedImageUrl;
      console.log('Final wish data:', {
        wishId: response.data.wish.id,
        fanart: response.data.wish.fanart,
        originalUrl: submittedImageUrl
      });
    }

    return response.data;

  } catch (error) {
    console.error('Error in submitWish:', {
      error: error.response?.data || error,
      statusCode: error.response?.status,
      originalError: error
    });
    throw new Error(
      error.response?.data?.message || 
      'Failed to submit wish. Please try again.'
    );
  }
            }
