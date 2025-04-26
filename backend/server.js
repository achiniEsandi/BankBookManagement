import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import financeRoutes from "./routes/finance.js"; 
import balanceSheetRoutes from './routes/balanceSheetRoutes.js';
import bankBookRoutes from './routes/bankBookRoutes.js';
import profitLossRoutes from './routes/profitLossRoutes.js';
import pettyCashRoutes from './routes/pettyCashRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import quotationRoutes from './routes/quotationRoutes.js';
import appointmentRoutes from "./routes/appointmentRoutes.js";
import bankAccountRoutes from './routes/bankAccountRoutes.js';
import profitLossRouter from './routes/profitLossRoutes.js';
import pdfRoutes from "./routes/pdfRoutes.js";
//import transactionRoutes from './routes/transactionRoutes.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/payments', paymentRoutes);
app.use('/api/balance-sheet', balanceSheetRoutes);
app.use('/api/bank-book', bankBookRoutes);
app.use('/api/bank-account', bankAccountRoutes);
app.use('/api/profit-loss', profitLossRoutes);
//app.use('/api/petty-cash', pettyCashRoutes);
app.use('/api/pettycash', pettyCashRoutes);
app.use("/api/finance", financeRoutes); // Use finance routes
app.use("/api", financeRoutes);
app.use('/api/salary', salaryRoutes);
app.use('/api/quotations', quotationRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use('/api/profit-loss', profitLossRouter);
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


