export async function onRequest(context) {
    const { request, env } = context;

    // Extract wishId from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const wishId = pathParts[pathParts.length - 1];

    // 🚫 If the request is for `/api/wishes/`, do nothing (let `api/wishes.js` handle it)
    if (!wishId || wishId === "wishes") {
        return new Response(JSON.stringify({ 
            error: "Invalid request. Please provide a valid wish ID."
        }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }

    // Handle GET requests for specific wish ID
    if (request.method === "GET") {
        try {
            let wishes = await env.WISHES_KV.get("list", { type: "json" }) || [];
            if (!Array.isArray(wishes)) wishes = [];

            // Find the specific wish
            const wish = wishes.find(w => w.number === Number(wishId));

            if (!wish) {
                return new Response(JSON.stringify({ 
                    error: "Wish not found",
                    requestedId: wishId
                }), {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    }
                });
            }

            return new Response(JSON.stringify(wish), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });

        } catch (error) {
            console.error("Error fetching wish:", error);
            return new Response(JSON.stringify({ 
                error: "Failed to fetch wish.",
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

    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}
