import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/db";
import Product, { type Product as ProductType } from "@/models/Product";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
}); // Create a new GoogleGenAI client

export async function POST(request: Request) {
  // use the embeddings already stored in MongoDB inside the GenAI prompt

  try {
    const { query } = await request.json();

    await connectDB();

    // load products (including their stored embeddings)
    const products = (await Product.find({}).lean()) as Array<ProductType & { _id: unknown; embedding?: number[] }>;

    // build a compact prompt that includes product metadata and embeddings
    const productEntries = products.map((p) => ({
      id: String(p._id),
      title: p.title,
      description: p.description,
      category: p.category,
      embedding: Array.isArray(p.embedding) ? p.embedding : [],
    }));

    const freeModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
    ];

    const promptHeader = `You are given a user search query and a list of products. Each product has an id, title, description, category, and a numeric embedding vector. Using the product embeddings from MongoDB, rank the products by relevance to the user's query and return a JSON array of up to 20 product ids in descending relevance order. Return ONLY the JSON array.\n\nUser query: "${query.replace(/"/g, '\\"')}"\n\nProducts:`;

    // include products but limit overall prompt size by trimming embedding length if necessary
    const maxProducts = 200; // safety cap
    const entriesToInclude = productEntries.slice(0, maxProducts);

    const promptBody = entriesToInclude
      .map((p) => `ID: ${p.id} | title: ${p.title} | category: ${p.category} | description: ${p.description} | embedding: ${JSON.stringify(p.embedding)}`)
      .join("\n");

    let rankedIds: string[] = [];

    for (const model of freeModels) {
      try {
        const res = await client.models.generateContent({
          model,
          contents: promptHeader + "\n\n" + promptBody + "\n\nRespond with a JSON array like [\"id1\",\"id2\"]",
        });

        const text = res.text || "";
        // try to extract the first JSON array in the response
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");
        if (start !== -1 && end !== -1 && end > start) {
          const arrText = text.slice(start, end + 1);
          try {
            const parsed = JSON.parse(arrText);
            if (Array.isArray(parsed)) {
              rankedIds = parsed.map(String);
              break;
            }
          } catch (err) {
            // fallthrough to try next model
            console.warn("Failed to parse model ranking output", err);
            continue;
          }
        }
      } catch {
        // try the next model
        continue;
      }
    }

    // If model didn't produce ranked ids, fall back to safe regex search
    if (rankedIds.length === 0) {
      const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const fallback = await Product.find({
        $or: [
          { title: { $regex: safe, $options: "i" } },
          { description: { $regex: safe, $options: "i" } },
          { category: { $regex: safe, $options: "i" } },
        ],
      }).lean();
      return Response.json({ products: fallback });
    }

    // fetch products in the order of rankedIds
    const idSet = new Set(rankedIds);
    const matched = products.filter((p) => idSet.has(String(p._id)));
    // sort by rankedIds order
    const byIdIndex = new Map(rankedIds.map((id, i) => [id, i]));
    matched.sort((a, b) => (byIdIndex.get(String(a._id)) || 0) - (byIdIndex.get(String(b._id)) || 0));

    return Response.json({ products: matched });
  } catch (error) {
    console.error("ai-search route error:", error);
    return Response.json({ products: [] }, { status: 500 });
  }
}
