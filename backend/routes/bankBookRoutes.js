import express from "express";


import {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getAllTransactions
  } from "../controllers/bankBookController.js";

const router = express.Router();

// Route for adding a transaction to the bank book
router.post("/add-transaction", addTransaction);
router.put("/transaction/update/:transactionId", updateTransaction);
router.delete("/transaction/delete/:transactionId", deleteTransaction);
router.get("/transactions", getAllTransactions);

// GET transactions by account
router.get('/account/:accountId', async (req, res) => {
  try {
    const txns = await BankBookTransaction.find({ bank_account_id: req.params.accountId })
    return res.json(txns)
  } catch (err) {
    console.error('Fetch txns error:', err)
    return res.status(500).json({ error: 'Failed to fetch transactions' })
  }
})




export default router;
