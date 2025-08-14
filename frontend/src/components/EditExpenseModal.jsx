// src/components/EditExpenseModal.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';

const EditExpenseModal = ({ expense, onClose, onExpenseUpdated }) => {
    // State for the form fields
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // This `useEffect` hook pre-fills the form when the component receives a new expense
    useEffect(() => {
        if (expense) {
            setDescription(expense.description);
            setAmount(expense.amount);
            setCategory(expense.category);
        }
    }, [expense]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await api.put(`/expenses/${expense._id}`, {
                description,
                amount: parseFloat(amount),
                category,
            });
            onExpenseUpdated(); // Notify parent to refresh the list
            onClose(); // Close the modal
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update expense.');
        } finally {
            setLoading(false);
        }
    };

    // If no expense is provided, don't render anything
    if (!expense) return null;

    return (
        // Modal Overlay
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Modal Content */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Expense</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}
                    
                    <div className="mb-4">
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            id="edit-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="edit-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            id="edit-amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            id="edit-category"
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

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-400"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpenseModal;