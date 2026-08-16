import { z } from "zod";

export const productSchema = z.object({

    productName: z
        .string()
        .trim()
        .min(3, "Product name must be at least 3 characters")
        .max(100, "Product name cannot exceed 100 characters"),

    price: z
        .number({
            error: "Price is required"
        })
        .positive("Price must be greater than zero")

});

export type ProductFormData = z.infer<typeof productSchema>;