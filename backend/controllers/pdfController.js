//for bank book management

import PDFDocument from "pdfkit";
import BankBookTransaction from "../models/BankBookTransaction.js";
import BankAccount from "../models/BankAccount.js";

export const generateBankStatementPDF = async (req, res) => {
  try {
    const { accountId } = req.params;
    const account = await BankAccount.findById(accountId);
    const transactions = await BankBookTransaction.find({ bank_account_id: accountId }).sort({ createdAt: 1 });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Disposition', 'attachment; filename="bank_statement.pdf"');
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // BANK STATEMENT TITLE
    doc.fontSize(20).text("Cosmo Exports Lanka (PVT) LTD", 50, 120, { align: "center" });
    doc.fontSize(12).text("496/1, Naduhena, Meegoda, Sri Lanka", { align: "center" });
    doc.text("Phone: +94 77 086 4011  +94 11 275 2373 | Email: cosmoexportslanka@gmail.com", { align: "center" });
    doc.moveDown(2);
    doc.fontSize(18).text("Bank Statement", { align: "center" });
    doc.moveDown();

    // ACCOUNT HOLDER DETAILS
    doc.fontSize(12).fillColor('black').text('ACCOUNT HOLDER DETAILS', { bold: true, background: 'grey' });
    doc.moveDown(0.5);
    doc.fontSize(11)
      .text(`Account Holder Name: John Doe`)
      .text(`Registered Mobile Number: +94 77 086 4011`)
      .text(`Residential Address: Sri Lanka`);
    doc.moveDown(1);

    // ACCOUNT DETAILS
    doc.fontSize(12).fillColor('black').text('ACCOUNT DETAILS', { bold: true });
    doc.moveDown(0.5);
    doc.fontSize(11)
      .text(`Account Type: Savings`)
      .text(`Account Balance: ${account.balance}`)
      .text(`Total Balance: ${account.balance}`)
    doc.moveDown(1);

    // ACCOUNT STATEMENT
    doc.fontSize(12).fillColor('black').text('ACCOUNT STATEMENT');
    doc.moveDown(0.5);

    // Table Header
    doc.fontSize(10).fillColor('black');
    const tableTop = doc.y;
    const colWidths = [60, 60, 100, 60, 50, 50, 60];
    const headers = ['Txn Date', 'Value Date', 'Description', 'Ref No/Cheque No', 'Debit', 'Credit', 'Balance'];
    let x = doc.x;
    headers.forEach((header, i) => {
      doc.text(header, x, tableTop, { width: colWidths[i], align: 'left' });
      x += colWidths[i];
    });
    doc.moveDown(0.5);
    doc.moveTo(doc.x, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();

    // Table Rows
    let y = doc.y + 2;
    transactions.forEach(tx => {
      let debit = '', credit = '';
      if (['withdrawal', 'bank_charge'].includes(tx.transaction_type)) {
        debit = tx.amount;
      } else {
        credit = tx.amount;
      }
      x = doc.x;
      const txnDate = tx.createdAt ? new Date(tx.createdAt) : null;
      const txnDateStr = txnDate && !isNaN(txnDate) ? txnDate.toLocaleDateString() : '';
      doc.text(txnDateStr, x, y, { width: colWidths[0] });
      x += colWidths[0];
      doc.text(txnDateStr, x, y, { width: colWidths[1] });
      x += colWidths[1];
      doc.text(tx.description || '', x, y, { width: colWidths[2] });
      x += colWidths[2];
      doc.text('_________', x, y, { width: colWidths[3] });
      x += colWidths[3];
      doc.text(debit ? debit.toString() : '', x, y, { width: colWidths[4] });
      x += colWidths[4];
      doc.text(credit ? credit.toString() : '', x, y, { width: colWidths[5] });
      x += colWidths[5];
      doc.text(tx.current_balance.toString(), x, y, { width: colWidths[6] });
      y += 18;
    });
    doc.moveDown(2);

    // REWARD POINTS SUMMARY (placeholder)
    doc.fontSize(12).fillColor('black').text('REWARD POINTS SUMMARY');
    doc.moveDown(0.5);
    doc.fontSize(11)
      .text('Savings Account number: ' + (account.accountNumber || '__________'))
      .text('Card Number: __________')
      .text('Earnings: __________')
      .text('Total Balance: ' + account.balance);
    doc.moveDown(1);

    // ACCOUNT RELATED OTHER INFO (placeholder)
    doc.fontSize(12).fillColor('black').text('ACCOUNT RELATED OTHER INFO');
    doc.moveDown(0.5);
    doc.fontSize(11)
      .text('Account Type: Savings')
      .text('Account Number: ' + (account.accountNumber || '__________'))
      .text('MICR: __________')
      .text('IFSC: __________');

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("Failed to generate statement.");
  }
};
