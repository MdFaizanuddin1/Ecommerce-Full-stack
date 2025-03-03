import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// console.log("origin is", process.env.CORS_ORIGIN);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public/temp"));

app.use(cookieParser());

// import routes
import healthCheckRouter from "./routes/healthCheck.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routes.js";
import wishListRouter from "./routes/wishList.routes.js";
import reviewRouter from "./routes/review.routes.js";
import addressRouter from "./routes/address.routes.js";
import categoryRouter from "./routes/category.routes.js";

//---------- sales

// import billRouter from "./routes/sales/bill.routes.js";
// import salesSummaryRouter from "./routes/sales/salesSummary.routes.js";

import inventoryRouter from "./routes/inventory.routes.js";

// routes
// healthCheck route
app.use("/api/v1/healthCheck", healthCheckRouter);
// user routes
app.use("/api/v1/users", userRouter);
// product routes
app.use("/api/v1/product", productRouter);
//cart routes
app.use("/api/v1/cart", cartRouter);
//wish list routes
app.use("/api/v1/wishList", wishListRouter);
// review routes
app.use("/api/v1/review", reviewRouter);
// address routes
app.use("/api/v1/address", addressRouter);
// category route
app.use("/api/v1/category", categoryRouter);

//-------------sales

// bill
// app.use("/api/v1/bill", billRouter);

// ------------ inventory
app.use("/api/v1/inventory", inventoryRouter);

// --------- summary
// app.use("/api/v1/report", salesSummaryRouter);

export { app };
