// functions/api/uploadImage.js
export async function onRequest(context) {
    const { request, env } = context;

    // Log initial request details
    console.log('Upload request received:', {
        method: request.method,
        headers: Object.fromEntries(request.headers),
        bucketUrl: env.BUCKET_URL
    });

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
        });
    }

    // Verify request method
    if (request.method !== "POST") {
        console.log('Invalid method:', request.method);
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }

    try {
        // Parse the multipart form data
        const formData = await request.formData();
        const file = formData.get("file");

        // Validate file presence
        if (!file) {
            console.log('No file provided in request');
            return new Response(JSON.stringify({ error: "No file provided" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        // Log file details
        console.log('File received:', {
            name: file.name,
            type: file.type,
            size: file.size
        });

        // Validate file type
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(file.type)) {
            console.log('Invalid file type:', { extension: fileExtension, mimeType: file.type });
            return new Response(JSON.stringify({ 
                error: "Invalid file type. Only JPG, PNG, GIF, and WebP are allowed." 
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            console.log('File too large:', file.size);
            return new Response(JSON.stringify({ 
                error: "File size exceeds 10MB limit." 
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const fileName = `${timestamp}-${randomString}.${fileExtension}`;

        // Convert file to ArrayBuffer
        const imageBuffer = await file.arrayBuffer();

        console.log('Attempting to upload to R2:', {
            bucketName: env.FANART_BUCKET.name,
            fileName: fileName,
            fileSize: imageBuffer.byteLength,
            bucketUrl: env.BUCKET_URL
        });

        // Upload to R2
        try {
            await env.FANART_BUCKET.put(fileName, imageBuffer, {
                httpMetadata: {
                    contentType: file.type
                }
            });
        } catch (uploadError) {
            console.error('R2 upload error:', uploadError);
            throw new Error(`R2 upload failed: ${uploadError.message}`);
        }

        // Generate public URL
        const imageUrl = `${env.BUCKET_URL}/${fileName}`;
        console.log('Upload successful, generated URL:', imageUrl);

        // Return success response
        return new Response(JSON.stringify({ 
            success: true, 
            url: imageUrl 
        }), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=31536000"
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        return new Response(JSON.stringify({ 
            error: "Failed to upload image", 
            details: error.message 
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }
                }
