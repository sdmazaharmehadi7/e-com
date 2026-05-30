import OpenAI from "openai";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const MODELS = ["gpt-4o-mini", "gpt-3.5-turbo", "gpt-4"];

async function generateKeywords(query) {
    for (const model of MODELS) {
        try {
            const aiResponse = await client.chat.completions.create({
                model: model,
                messages: [{ role: "user", content: "Extract product search keywords from this query. Return only comma-separated keywords, nothing else: " + query }],
            });
            const keywords = aiResponse?.choices?.[0]?.message?.content?.trim();
            if (keywords) {
                console.log(`✓ Generated keywords using ${model}:`, keywords);
                return { keywords, aiUsed: true };
            }
        } catch (err) {
            console.warn(`✗ Model ${model} failed:`, err.message);
        }
    }
    console.log("⚠ All AI models failed, falling back to query-based search");
    return { keywords: query, aiUsed: false };
}

export async function POST(request) {
    try {
        const { query } = await request.json();
        if (!query) return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });

        const { keywords, aiUsed } = await generateKeywords(query);
        if (aiUsed) console.log("Using AI-generated keywords for search");
        else console.log("Using direct query-based search");

        await connectDB();

        const keywordList = keywords.split(",").map(k => k.trim()).filter(k => k);
        
        const products = await Product.find({
            $or: keywordList.map(keyword => ({
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { category: { $regex: keyword, $options: "i" } },
                ]
            }))
        }).lean();

        return new Response(JSON.stringify(products), { headers: { "Content-Type": "application/json" } });
    } catch (err) {
        console.error("/api/ai-search error:", err);
        return new Response(JSON.stringify({ error: err.message || "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}