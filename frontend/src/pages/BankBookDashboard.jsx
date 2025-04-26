// src/pages/BankBookDashboard.jsx
import React, { useEffect, useState } from 'react'
import bankIcon from '../assets/bank_icon.png';
import axios from 'axios'

const BankBookDashboard = () => {
  const [accounts, setAccounts] = useState([])
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    initialBalance: ''
  })

  // fetch all bank accounts
  const fetchAccounts = async () => {
    try {
      const { data } = await axios.get('/api/bank-account')
      setAccounts(data)
    } catch (err) {
      console.error('Failed to fetch accounts', err)
    }
  }

  // fetch transactions for selected account
  const [transactionData, setTransactionData] = useState({
    type: '',
    amount: '',
    remarks: ''
  })
  const [transactions, setTransactions] = useState([])

  const fetchTransactions = async () => {
    if (!selectedAccount) return
    try {
      const { data } = await axios.get(
        `/api/bank-account/transaction/account/${selectedAccount._id}`
      )
      setTransactions(data)
    } catch (err) {
      console.error('Failed to fetch transactions', err)
    }
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  useEffect(() => {
    if (selectedAccount) fetchTransactions()
  }, [selectedAccount])

  // add a new bank account
  const handleAddAccount = async () => {
    try {
      await axios.post('/api/bank-account/create', {
        ...formData,
        initialBalance: parseFloat(formData.initialBalance)
      })
      setFormData({ bankName: '', accountNumber: '', initialBalance: '' })
      fetchAccounts()
    } catch (err) {
      console.error('Failed to add account', err)
    }
  }

  // add a transaction
  const handleAddTransaction = async () => {
    if (!transactionData.type || !transactionData.amount) {
      return alert('Please fill all fields.')
    }
    try {
      await axios.post('/api/bank-book/transaction/add-transaction', {
        accountId: selectedAccount._id,
        ...transactionData,
        amount: parseFloat(transactionData.amount)
      })
      setTransactionData({ type: '', amount: '', remarks: '' })
      fetchTransactions()
      fetchAccounts()
    } catch (err) {
      console.error('Failed to add transaction', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page Header */}
      <header className="max-w-4xl mx-auto mb-8 flex items-center space-x-4">
      <img src={bankIcon} alt="Bank" className="h-10 w-10" />
        <h1 className="text-3xl font-extrabold text-gray-800">
          Bank Book Management
        </h1>
      </header>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Add Account Card */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Add New Bank Account
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Bank Name"
              className="border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-200"
              value={formData.bankName}
              onChange={e =>
                setFormData({ ...formData, bankName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Account Number"
              className="border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-200"
              value={formData.accountNumber}
              onChange={e =>
                setFormData({ ...formData, accountNumber: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Initial Balance"
              className="border border-gray-300 rounded px-4 py-2 focus:ring focus:ring-blue-200"
              value={formData.initialBalance}
              onChange={e =>
                setFormData({ ...formData, initialBalance: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleAddAccount}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-6 py-2 transition"
          >
            Add Account
          </button>
        </section>

        {/* Account List */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Your Bank Accounts
          </h2>
          <div className="space-y-3">
            {accounts.map(acc => (
              <button
                key={acc._id}
                onClick={() => setSelectedAccount(acc)}
                className={`w-full text-left px-4 py-3 rounded-lg transition
                  ${
                    selectedAccount?._id === acc._id
                      ? 'bg-yellow-300 border border-yellow-600 font-bold'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }
                `}
              >
                <span className="font-semibold text-gray-300">
                  {acc.bankName}
                </span>{' '}
                - <span className="text-gray-200">{acc.accountNumber}</span>{' '}
                <span className="text-gray-200">(LKR {acc.balance})</span>
              </button>
            ))}
          </div>
        </section>

        {/* Transactions */}
        {selectedAccount && (
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Transactions for {selectedAccount.bankName}
            </h2>

            {/* Transaction Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <select
                className="border border-gray-300 rounded px-4 py-2"
                value={transactionData.type}
                onChange={e =>
                  setTransactionData({ ...transactionData, type: e.target.value })
                }
              >
                <option value="">Type</option>
                <option value="deposit">Deposit</option>
                <option value="withdrawal">Withdrawal</option>
                <option value="bank_charge">Bank Charge</option>
                <option value="unknown_deposit">Unknown Deposit</option>
              </select>
              <input
                type="number"
                placeholder="Amount"
                className="border border-gray-300 rounded px-4 py-2"
                value={transactionData.amount}
                onChange={e =>
                  setTransactionData({ ...transactionData, amount: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Remarks"
                className="border border-gray-300 rounded px-4 py-2"
                value={transactionData.remarks}
                onChange={e =>
                  setTransactionData({ ...transactionData, remarks: e.target.value })
                }
              />
              <button
                onClick={handleAddTransaction}
                className="bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg px-6 py-2 transition"
              >
                Add Transaction
              </button>
            </div>

            {/* Transaction List */}
            {transactions.length === 0 ? (
              <p className="text-gray-500">No transactions yet.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {transactions.map(txn => (
                  <li
                    key={txn._id}
                    className="py-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {txn.transaction_type.replace('_', ' ')} – ₹{txn.amount}
                      </p>
                      <p className="text-sm text-gray-500">
                        {txn.description} •{' '}
                        {new Date(txn.transactionDate).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default BankBookDashboard
