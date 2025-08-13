// src/components/ExpenseForm.jsx

import React, { useState } from "react";
// NEW: Import our configured api service
import api from "../services/api";

const ExpenseForm = ({ onExpenseAdded }) => {
  // Component State (this part remains the same)
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // We no longer need to get the token from context here,
  // because our 'api' service handles it automatically.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // --- Start of the corrected code to paste ---

    // console.log('Submitting with values:', { description, amount }); // A useful debugging line

    // 1. Validation Check: Ensures neither field is an empty string.
    if (!description || !amount) {
      setError("Please fill out both description and amount.");
      return;
    }
    // 2. Positive Number Check: Ensures the amount is greater than zero.
    if (parseFloat(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/expenses", {
        description,
        amount: parseFloat(amount),
        category,
      });

      // Clear form on success
      setDescription("");
      setAmount("");
      setCategory("Food");

      // Notify parent to refresh list
      //This line says, "If my parent gave me an onExpenseAdded function, I will call it now."
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add expense. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // The JSX for the form below remains exactly the same.
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Lunch with team"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g., 25.50"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Bills</option>
              <option>Entertainment</option>
              <option>Shopping</option>
              <option>Other</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;

/*

workflow of re-rendering enite list of expenses after adding new expense in list by using following prop

      if (onExpenseAdded) {
        onExpenseAdded();
      }

Visual Flow
Here is the complete cycle:

Parent: Defines handleExpenseAdded.

Parent: Renders <ExpenseForm onExpenseAdded={handleExpenseAdded} />. (prop travels down)

Child: User submits the form. The API call succeeds.

Child: Calls the onExpenseAdded() function it received. (signal travels up)

Parent: The handleExpenseAdded function is executed.

Parent: The fetchExpenses function runs, gets the new list, and updates the state.

Parent: The component re-renders, showing the updated expense list.




*/
