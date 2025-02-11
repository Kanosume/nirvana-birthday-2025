export async function onRequest(context) {
    const { request, env } = context;

    try {
        const contentType = request.headers.get("Content-Type") || "";
        console.log("Received Content-Type:", contentType);

        let data;
        if (contentType.includes("application/json")) {
            data = await request.json();
            console.log("Received JSON data:", data);
        } else {
            return new Response(JSON.stringify({
                error: "Unsupported Content-Type. Use JSON.",
                receivedType: contentType
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        if (!data.name?.trim() || !data.message?.trim()) {
            return new Response(JSON.stringify({
                error: "Missing required fields: name and message",
                received: { name: data.name, message: data.message }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }

        let wishes = await env.WISHES_KV.get("list", { type: "json" }) || [];
        if (!Array.isArray(wishes)) wishes = [];

        const newWish = {
            id: Date.now(),
            number: wishes.length + 1,
            name: data.name.trim(),
            twitter: data.twitter ? data.twitter.trim() : null,
            message: data.message.trim(),
            fanart: data.fanart || null,  // Explicitly preserve fanart URL
            createdAt: new Date().toISOString()
        };

        console.log("Saving wish with data:", {
            ...newWish,
            hasFanart: !!newWish.fanart
        });

        wishes.push(newWish);
        await env.WISHES_KV.put("list", JSON.stringify(wishes));

        // Double-check saved data
        const savedWishes = await env.WISHES_KV.get("list", { type: "json" });
        const savedWish = savedWishes.find(w => w.id === newWish.id);
        console.log("Verified saved wish:", {
            hasFanart: !!savedWish?.fanart,
            fanartUrl: savedWish?.fanart
        });

        return new Response(JSON.stringify({
            success: true,
            wish: newWish
        }), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });
    } catch (error) {
        console.error("Error processing wish:", error);
        return new Response(JSON.stringify({
            error: "Failed to submit wish",
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
