import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, Banknote } from "lucide-react";

export default function Dashboard() {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    fetchBankAccounts();
  }, []);

  const fetchBankAccounts = async () => {
    try {
      const response = await axios.get("/api/bank-account");
      setBankAccounts(response.data);
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    }
  };

  const handleSelectAccount = (account) => {
    setSelectedAccount(account);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bank Book Dashboard</h1>
        <button
          onClick={() => alert("Open Add Bank Account Modal")}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Bank Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bankAccounts.map((account) => (
          <div
            key={account._id}
            onClick={() => handleSelectAccount(account)}
            className="p-4 bg-white rounded-xl shadow cursor-pointer hover:bg-blue-50"
          >
            <h2 className="text-lg font-semibold">{account.bankName}</h2>
            <p>Account Number: {account.accountNumber}</p>
            <p>Balance: ₹{account.balance}</p>
          </div>
        ))}
      </div>

      {selectedAccount && (
        <div className="bg-gray-100 p-4 rounded-xl mt-6">
          <h3 className="text-xl font-bold mb-2">
            {selectedAccount.bankName} - {selectedAccount.accountNumber}
          </h3>
          <button
            onClick={() => alert("Open Add Transaction Form")}
            className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Banknote className="w-5 h-5" />
            Add Deposit / Withdrawal
          </button>
        </div>
      )}
    </div>
  );
}
