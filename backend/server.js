import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";


import bankBookRoutes from './routes/bankBookRoutes.js';
import bankAccountRoutes from './routes/bankAccountRoutes.js';
import pdfRoutes from "./routes/pdfRoutes.js";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bank-book', bankBookRoutes);
app.use('/api/bank-account', bankAccountRoutes);
app.use("/api/pdf", pdfRoutes);

//app.use("/api/transactions", transactionRoutes);


const PORT = process.env.PORT || 5000;

// Connect to MongoDB with success and error messages
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });


