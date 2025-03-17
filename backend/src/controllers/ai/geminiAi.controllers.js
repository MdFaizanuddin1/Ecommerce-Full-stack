import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import run from "../../utils/geminiAi.js";

const interactWithAi = asyncHandler(async (req, res) => {
  try {
    const { prompt, product, products } = req.body;
    let productContext = "";
    if (product) {
      productContext += `Product Name: ${product.productName}\nDescription: ${product.description}\nPrice: ₹${product.price}\nCategory: ${product.category}\nAvailability: ${product.stock > 0 ? "In Stock" : "Out of Stock"}\ngender: ${product.gender}\nbestseller: ${product.bestseller}\nage: ${product.age}\n\n`;
    }

    if (products && products.length > 0) {
      productContext +=
        "Available Products:\n" +
        products
          .map(
            (prod) =>
              `- **${prod.productName}**\n  Description: ${prod.description}\n  Price: ₹${prod.price}\n  Category: ${prod.category}\n  Availability: ${prod.stock > 0 ? "In Stock" : "Out of Stock"}\n  Gender: ${prod.gender}\n  Bestseller: ${prod.bestseller ? "Yes" : "No"}\n  Age Group: ${prod.age}\n  Color: ${prod.color}\n  Brand: ${prod.brand}\n  Material: ${prod.material}\n  Rating: ${prod.rating}\n`
          )
          .join("\n");
    }
    const response = await run(prompt, productContext);
    if (!response) throw new ApiError(500, "Error from gemini");

    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "response from ai fetched successfully")
      );
  } catch (error) {
    console.log("error is ", error);
    throw new ApiError(500, `error is ${error}`);
  }
});

export { interactWithAi };
