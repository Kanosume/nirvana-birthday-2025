export async function onRequest(context) {
    const kv = context.env.WISHES_KV;
    if (!kv) {
        return new Response(
            JSON.stringify({ error: "KV binding not found" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const { searchParams } = new URL(context.request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 10;

        let wishes = await kv.get("list", { type: "json" }) || [];

        if (!Array.isArray(wishes)) wishes = [];

        wishes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        const paginatedWishes = wishes.slice((page - 1) * limit, page * limit);

        return new Response(JSON.stringify(paginatedWishes), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
