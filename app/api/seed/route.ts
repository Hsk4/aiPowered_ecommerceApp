
import connectDB from "@/lib/db";

import Product, { type Product as ProductType } from "@/models/Product";

import seedProductsJson from "@/lib/seedProducts.json";

const seedProducts: ProductType[] = seedProductsJson;

export async function GET() {
    await connectDB();

    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(seedProducts);

    return Response.json({
        success: true,
        count: createdProducts.length,
        products: createdProducts,
    });
}