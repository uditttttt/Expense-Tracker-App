// src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react';
import api from '../services/api';
import ExpenseForm from '../components/ExpenseForm.jsx';

const DashboardPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchExpenses = async () => {
        try {
            setError(null);
            const { data } = await api.get('/expenses');
            setExpenses(data);
        } catch (error) {
            console.error('Failed to fetch expenses', error);
            setError('Could not load your expenses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleExpenseAdded = () => {
        fetchExpenses();
    };

    // NEW: Function to handle deleting an expense
    const handleDeleteExpense = async (expenseId) => {
        // Ask for confirmation before deleting
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await api.delete(`/expenses/${expenseId}`);
                
                // For an instant UI update, we filter the deleted expense out of our state
                // This is faster than re-fetching the entire list from the server
                setExpenses(prevExpenses =>
                    prevExpenses.filter(expense => expense._id !== expenseId)
                );
            } catch (error) {
                console.error('Failed to delete expense', error);
                // Optionally, set an error message to display to the user
                setError('Failed to delete expense. Please try again.');
            }
        }
    };

    if (loading) {
        return <div className="text-center p-8">Loading expenses...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Dashboard</h1>
            
            <ExpenseForm onExpenseAdded={handleExpenseAdded} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800">Your Expenses</h2>

                {error && <p className="mt-4 text-center text-red-500">{error}</p>}

                {!error && expenses.length > 0 ? (
                    <ul className="space-y-4 mt-4">
                        {expenses.map((expense) => (
                            <li key={expense._id} className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition">
                                <div>
                                    <p className="font-semibold text-gray-800">{expense.description}</p>
                                    <p className="text-sm text-gray-500">{expense.category} - {new Date(expense.date).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p className="text-lg font-bold text-gray-900">${expense.amount.toFixed(2)}</p>
                                    {/* UPDATED: Delete button added */}
                                    <button 
                                        onClick={() => handleDeleteExpense(expense._id)}
                                        className="text-red-500 hover:text-red-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        aria-label="Delete expense"
                                    >
                                        {/* Simple SVG Trash Icon */}
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    !error && <p className="text-center text-gray-500 mt-4">You have no expenses yet. Add one to get started!</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;


/*
## How the Corrected Code Works
Component Combination: We've imported our ExpenseForm.jsx component and placed it directly inside the DashboardPage.jsx return statement.

Automatic Refresh Mechanism: This is the most important part.

In DashboardPage.jsx, we create the handleExpenseAdded function. Its only job is to call our original fetchExpenses function.

We pass this function as a prop to our form: <ExpenseForm onExpenseAdded={handleExpenseAdded} />.

Inside ExpenseForm.jsx, after a new expense is successfully saved to the database, it calls this onExpenseAdded() prop.

This triggers the fetchExpenses function in the parent DashboardPage, which gets the new, updated list from the server and re-renders the UI.

-----------------------------------------------------------

## How the Delete Function Works
The Delete Button: A new button with a trash can icon is added to each item in the expense list. Its onClick event calls our new handleDeleteExpense function, passing the unique _id of that specific expense.

Confirmation Dialog: To prevent accidental deletions, window.confirm() shows a simple "Are you sure?" pop-up. The deletion only proceeds if the user clicks "OK".

API Call: The handleDeleteExpense function makes an asynchronous call to our backend using api.delete(), targeting the correct endpoint (e.g., /api/expenses/60f8e9d2...).

Instant UI Update: Upon a successful deletion, instead of re-fetching the entire list from the server, we use a more efficient method. setExpenses() is called with a function that filters the existing expenses array, creating a new array that excludes the item with the matching _id. React then automatically re-renders the list, and the item vanishes instantly.


*/