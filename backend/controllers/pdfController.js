//for bank book management

import PDFDocument from "pdfkit";
import BankBookTransaction from "../models/BankBookTransaction.js";
import BankAccount from "../models/BankAccount.js";

export const generateBankStatementPDF = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await BankAccount.findById(accountId);
    const transactions = await BankBookTransaction.find({ bank_account_id: accountId });

    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', 'attachment; filename="bank_statement.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(18).text(`Bank Statement: ${account.bankName}`, { align: 'center' });
    doc.moveDown();

    transactions.forEach(tx => {
      doc.fontSize(12).text(`${tx.transactionDate.toDateString()} | ${tx.transaction_type.toUpperCase()} | ₹${tx.amount} | ${tx.description} | Balance: ₹${tx.current_balance}`);
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Failed to generate statement.");
  }
};
