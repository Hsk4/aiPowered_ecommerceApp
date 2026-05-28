
import connectDB from "@/lib/db";

import Product, { type Product as ProductType } from "@/models/Product";

import seedProductsJson from "@/lib/seedProducts.json";

import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
});

function buildFallbackEmbedding(text: string, dimensions = 768): number[] {
    const vector = new Array(dimensions).fill(0);

    for (let index = 0; index < text.length; index += 1) {
        const charCode = text.charCodeAt(index);
        const slot = index % dimensions;
        vector[slot] += ((charCode * (index + 1)) % 997) / 997;
    }

    const magnitude = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1;
    return vector.map((value) => Number((value / magnitude).toFixed(6)));
}

async function generateVector(text: string): Promise<number[]> {
    try {
        const response = await client.models.embedContent({
            model: "gemini-embedding-2",
            contents: text,
            config: {
                outputDimensionality: 768,
            },
        });

        return response.embeddings?.[0]?.values ?? [];
    } catch (err) {
        console.error("Embedding generation failed:", err);
        return buildFallbackEmbedding(text);
    }
}

const seedProducts: ProductType[] = seedProductsJson;

export async function GET() {
    await connectDB();

    // Generate embeddings for each product (if key present). This runs in parallel.
    const productsWithEmbeddings = await Promise.all(
        seedProducts.map(async (p) => {
            const text = `title: ${p.title} | text: ${p.description}`;
            const embedding = await generateVector(text);
            return { ...p, embedding } as ProductType;
        })
    );

    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(productsWithEmbeddings);

    return Response.json({
        success: true,
        count: createdProducts.length,
        products: createdProducts,
    });
}