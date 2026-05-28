import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const client = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
}); // Create a new GoogleGenAI client

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    const freeModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
    ];

    let keyword = query;

    for (const model of freeModels) {
      try {
        const aiRes = await client.models.generateContent({
          model,
          contents: "Convert this into a short product keyword: " + query,
        });
        keyword = aiRes.text?.trim() || query;
        if (keyword) break;
      } catch {
        continue;
      }
    }

    await connectDB();

    const products = await Product.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { category: { $regex: keyword, $options: "i" } },
      ],
    });

    return Response.json({ products });
  } catch (error) {
    console.error("ai-search route error:", error);
    return Response.json({ products: [] }, { status: 500 });
  }
}
