export async function onRequest(context) {
    const { request, env } = context;

    // Handle OPTIONS
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    // Only allow GET requests
    if (request.method !== "GET") {
        return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
            status: 405,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    }

    try {
        const url = new URL(request.url);
        // Extract the ID from the /api/wishes/[id] pattern
        const pathParts = url.pathname.split('/');
        const wishNumber = pathParts[pathParts.length - 1];
        
        console.log("URL pathname:", url.pathname);
        console.log("Path parts:", pathParts);
        console.log("Searching for wish number:", wishNumber);

        // Validate wish number
        if (!wishNumber) {
            return new Response(JSON.stringify({ error: "Wish number is required" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        // Fetch wishes from KV
        let wishes = await env.WISHES_KV.get("list", { type: "json" }) || [];
        if (!Array.isArray(wishes)) wishes = [];
        
        console.log("Total wishes found:", wishes.length);
        console.log("Wishes data:", JSON.stringify(wishes));

        // Find wish by "number" field (convert both to numbers for comparison)
        const wish = wishes.find(w => Number(w.number) === Number(wishNumber));
        
        console.log("Found wish:", wish);

        if (!wish) {
            return new Response(JSON.stringify({ 
                error: "Wish not found",
                requestedNumber: wishNumber,
                availableNumbers: wishes.map(w => w.number)
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
            error: "Internal Server Error",
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
