export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);

  if (pathParts.length > 2) {
    return new Response(JSON.stringify({ 
      error: "Invalid request. This endpoint does not handle individual wish IDs."
    }), { 
      status: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    if (request.method === "GET") {
      let wishes = await env.WISHES_KV.get("list", { type: "json" }) || [];
      if (!Array.isArray(wishes)) wishes = [];

      return new Response(JSON.stringify({ wishes }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    if (request.method === "POST") {
      const contentType = request.headers.get("Content-Type") || "";
      let data = {};

      if (contentType.includes("application/json")) {
        data = await request.json();
        console.log("Received JSON data:", data);
      } else if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        data = {
          name: formData.get("name"),
          message: formData.get("message"),
          twitter: formData.get("twitter"),
          fanart: formData.get("fanart")
        };
      } else {
        return new Response(JSON.stringify({ 
          error: "Unsupported Content-Type"
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
          error: "Invalid input: 'name' and 'message' are required"
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
        createdAt: new Date().toISOString(),
        fanart: data.fanart || null  // Preserve fanart URL
      };

      console.log("Creating new wish with data:", newWish);

      wishes.push(newWish);
      await env.WISHES_KV.put("list", JSON.stringify(wishes));

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
    }

    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Error processing wish:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to process wish",
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
