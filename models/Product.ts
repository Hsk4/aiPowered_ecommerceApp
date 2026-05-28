import mongoose from "mongoose";

export interface Product {
	title: string;
	description: string;
	price: string;
	category: string;
	image: string;
}

const productSchema = new mongoose.Schema<Product>(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		}
 	},
	{
		timestamps: true,
	}
);

export default mongoose.models.Product || mongoose.model<Product>('Product', productSchema);