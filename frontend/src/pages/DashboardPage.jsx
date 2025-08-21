// src/pages/DashboardPage.jsx

import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ExpenseForm from "../components/ExpenseForm.jsx";
import EditExpenseModal from "../components/EditExpenseModal.jsx";
import Summary from "../components/Summary.jsx";
import CategoryChart from "../components/CategoryChart.jsx";
import FilterControls from "../components/FilterControls.jsx";
import Pagination from "../components/Pagination.jsx";
import BudgetManager from "../components/BudgetManager.jsx";
import BudgetProgress from "../components/BudgetProgress.jsx";

const MySwal = withReactContent(Swal);

const DashboardPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalAmount: 0, count: 0 });
  const [categorySummary, setCategorySummary] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "All",
    dateRange: "all_time",
    sortBy: "date_desc",
    page: 1, // UPDATED: Added 'page' to the filters state
  });
  // NEW: State to hold pagination info from the API
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);

  // REFACTORED: This is now the single function for all data fetching.
  // It replaces both the old 'useEffect' logic and the old 'refreshDashboard' logic.
  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      // FIXED: This now correctly fetches all four data points, including budgets.
      const [expensesRes, summaryRes, categoryRes, budgetsRes] =
        await Promise.all([
          api.get("/expenses", { params: filters }),
          api.get("/expenses/summary"),
          api.get("/expenses/category-summary"),
          api.get("/budgets"),
        ]);

      const { expenses, page, totalPages } = expensesRes.data;
      setExpenses(expenses);
      setPagination({ page, totalPages });
      setSummary(summaryRes.data);
      setCategorySummary(categoryRes.data);
      setBudgets(budgetsRes.data);
    } catch (err) {
      setError("Could not load your dashboard data. Please try again later.");
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // REFACTORED: The useEffect hook is now much simpler and just calls the main refresh function.
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  // UPDATED: When other filters change, we reset the page back to 1
  const handleFilterChange = useCallback((newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  }, []); // Empty dependency array means this function will never be re-created

  // NEW: Handler for changing the page via the Pagination component
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setFilters((prevFilters) => ({ ...prevFilters, page: newPage }));
    }
  };

  const handleOpenEditModal = (expense) => {
    setExpenseToEdit(expense);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setExpenseToEdit(null);
  };

  // UPDATED: This function now uses a SweetAlert2 confirmation dialog
  const handleDeleteExpense = (expenseId) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#fff", // Optional: for theme consistency
      customClass: {
        title: "text-gray-800",
        popup: "rounded-lg",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, proceed with the deletion logic
        const executeDelete = async () => {
          const loadingToast = toast.loading("Deleting expense...");
          try {
            await api.delete(`/expenses/${expenseId}`);
            toast.success("Expense deleted!", { id: loadingToast });
            refreshDashboard();
          } catch (error) {
            const message =
              error.response?.data?.message || "Failed to delete expense.";
            toast.error(message, { id: loadingToast });
          }
        };
        executeDelete();
      }
    });
  };

  if (loading) {
    return <div className="text-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Summary totalAmount={summary.totalAmount} count={summary.count} />
        </div>
        <div className="lg:col-span-3">
          <CategoryChart summaryData={categorySummary} />
        </div>
      </div>

      {/* NEW: Render the BudgetProgress component */}
      <BudgetProgress budgets={budgets} categorySpending={categorySummary} />

      <div className="mt-8">
        <BudgetManager onBudgetsUpdated={refreshDashboard} />
      </div>

      <ExpenseForm onExpenseAdded={refreshDashboard} />

      <div className="mt-8">
        <FilterControls filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Your Expenses</h2>
        {!error && expenses.length > 0 ? (
          <>
            <ul className="space-y-4 mt-4">
              {expenses.map((expense) => (
                <li
                  key={expense._id}
                  className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {expense.description}
                    </p>
                    <p className="text-sm text-gray-500">
                      {expense.category} -{" "}
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg font-bold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleOpenEditModal(expense)}
                      className="text-blue-500 hover:text-blue-700 p-1 rounded-full"
                      aria-label="Edit expense"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-full"
                      aria-label="Delete expense"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {/* NEW: Render the Pagination component below the list */}
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          !error && (
            <p className="text-center text-gray-500 mt-4">
              You have no expenses yet. Add one to get started!
            </p>
          )
        )}
      </div>

      {isModalOpen && (
        <EditExpenseModal
          expense={expenseToEdit}
          onClose={handleCloseEditModal}
          onExpenseUpdated={refreshDashboard}
        />
      )}
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

-----------------------------------------------------------

The Complete Filtering Workflow

Here is the full sequence of events when a user changes a filter:

The user selects "This Month" from the FilterControls dropdown.

The onChange handler inside FilterControls calls the handleFilterChange function (the prop it received).

The handleFilterChange function in DashboardPage calls setFilters with the new filter state.

The filters state in DashboardPage is updated.

React detects that filters has changed, and because filters is in the useEffect dependency array, it re-runs the useEffect hook.

The fetchDashboardData function inside the effect is called.

A new API request is made to /api/expenses, now with the updated filters as query parameters.

The backend returns the filtered list of expenses.

The expenses state is updated with the new, filtered data.

The component re-renders, showing the user the filtered list of expenses.


*/
