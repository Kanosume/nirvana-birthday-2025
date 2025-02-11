// functions/_middleware.js
async function handleCors(context) {
  // Add debugging
  console.log('Middleware processing request:', {
    method: context.request.method,
    url: context.request.url,
    headers: Object.fromEntries(context.request.headers)
  });

  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  const response = await context.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  
  // Log response details
  console.log('Middleware response:', {
    status: response.status,
    headers: Object.fromEntries(response.headers)
  });
  
  return response;
}

export const onRequest = [handleCors];
