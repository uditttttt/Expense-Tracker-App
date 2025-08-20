// src/components/BudgetManager.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

// A predefined list of categories that the user can set a budget for.
const categories = [
  "Food",
  "Transport",
  "Bills",
  "Entertainment",
  "Shopping",
  "Other"
];

const BudgetManager = () => {
  // State to hold the budget data, structured as an object: { Food: 100, Transport: 50 }
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);

  // Get the current month in "YYYY-MM" format, which our backend expects
  const getCurrentMonth = () => {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    return `${today.getFullYear()}-${month}`;
  };

  // Fetch existing budgets for the current month when the component mounts
  useEffect(() => {
    const fetchBudgets = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/budgets');
        // Convert the array of budget objects from the API into our state shape
        const budgetsMap = data.reduce((acc, budget) => {
          acc[budget.category] = budget.limit;
          return acc;
        }, {});
        setBudgets(budgetsMap);
      } catch (error) {
        toast.error('Could not fetch your budgets.');
        console.error("Failed to fetch budgets", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  // Handle changes to any budget input field
  const handleBudgetChange = (category, value) => {
    setBudgets(prevBudgets => ({
      ...prevBudgets,
      [category]: value
    }));
  };

  // Handle saving all the budgets
  const handleSaveBudgets = async () => {
    const loadingToast = toast.loading('Saving budgets...');
    try {
      const currentMonth = getCurrentMonth();
      // Create an array of promises for all the API calls
      const savePromises = categories.map(category => {
        const limit = parseFloat(budgets[category]) || 0;
        return api.post('/budgets', {
          category,
          limit,
          month: currentMonth
        });
      });

      // Wait for all the save requests to complete
      await Promise.all(savePromises);

      toast.success('Budgets saved successfully!', { id: loadingToast });
    } catch (error) {
      toast.error('Failed to save budgets.', { id: loadingToast });
      console.error("Failed to save budgets", error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Set Monthly Budgets</h2>
      {loading ? (
        <p>Loading budgets...</p>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category} className="flex items-center justify-between">
              <label htmlFor={`budget-${category}`} className="text-gray-700 font-medium">
                {category}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                <input
                  type="number"
                  id={`budget-${category}`}
                  value={budgets[category] || ''}
                  onChange={(e) => handleBudgetChange(category, e.target.value)}
                  placeholder="0.00"
                  className="w-32 pl-7 pr-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSaveBudgets}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Budgets
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetManager;

/*

The Goal: Transform a List into a Dictionary
First, let's be very clear about our goal. Your API gives you an array (a list) of objects like this:

JavaScript

// This is the 'data' from the API
[
  { category: 'Food', limit: 200 },
  { category: 'Transport', limit: 50 },
  { category: 'Bills', limit: 120 }
]
But for your React state, you need a single object (like a dictionary) that's easier to work with:

JavaScript

// This is the final shape we want for our state
{
  Food: 200,
  Transport: 50,
  Bills: 120
}
The .reduce() method is the perfect tool for this transformation.

The Analogy: Building a Contact List 📖
Imagine you have a stack of business cards, and your job is to create a single contact list page from them.

The Array (data): The stack of business cards.

The .reduce() method: The process of going through the stack one card at a time.

The Initial Value ({}): The blank sheet of paper you start with for your contact list.

The Accumulator (acc): The contact list as you are building it. It "accumulates" the entries.

The Current Item (budget): The single business card you are looking at in each step.

A Step-by-Step Trace of the Code
Here's the code again:

JavaScript

const budgetsMap = data.reduce((acc, budget) => {
  acc[budget.category] = budget.limit;
  return acc;
}, {});
Let's trace what happens loop by loop with our example data.

Start:

The process begins. The initial value is an empty object {}. This becomes our starting accumulator (acc).

acc is {}

Loop 1:

.reduce() picks up the first business card (budget) from the data array: { category: 'Food', limit: 200 }.

The code acc[budget.category] = budget.limit; runs.

This translates to: acc['Food'] = 200;

This means: "On our contact list (acc), add an entry for 'Food' and set its value to 200."

Our contact list (acc) now looks like this: { Food: 200 }.

The line return acc; passes this updated list to the next loop.

Loop 2:

.reduce() picks up the second business card (budget): { category: 'Transport', limit: 50 }.

Our accumulator (acc) is what we returned from the last loop: { Food: 200 }.

The code acc[budget.category] = budget.limit; runs again.

This translates to: acc['Transport'] = 50;

This means: "On our current contact list (acc), add a new entry for 'Transport' and set its value to 50."

Our contact list (acc) now looks like this: { Food: 200, Transport: 50 }.

return acc; passes this along.

Loop 3:

.reduce() picks up the third business card (budget): { category: 'Bills', limit: 120 }.

Our accumulator (acc) is { Food: 200, Transport: 50 }.

The code acc[budget.category] = budget.limit; runs.

This translates to: acc['Bills'] = 120;

Our contact list (acc) now looks like this: { Food: 200, Transport: 50, Bills: 120 }.

return acc; passes this along.

End:
There are no more cards in the stack. The .reduce() method is finished, and it returns the final value of the accumulator (acc). The budgetsMap variable is now assigned this final object:
{ Food: 200, Transport: 50, Bills: 120 }

Which is exactly the "dictionary" shape we needed for our state!


The Goal: Prepare All API Calls Without Waiting
The goal of this block is to create a "to-do list" of all the API calls that need to be made to save the budgets, but to do it all at once rather than one by one.

The Analogy: Ordering for a Group 🍕
Imagine you're ordering pizza for a group of friends. Everyone wants something different.

The categories array: Your list of friends' orders (['Pepperoni', 'Margherita', 'Veggie']).

The .map() method: You, going down the list one by one.

The api.post(...) call (without await): For each order, you write it down on a separate sticky note. You do not call the pizza place yet. You just prepare the order. This "prepared but not yet sent" sticky note is a Promise.

The savePromises array: Your final stack of sticky notes, with one order on each. It's an array of Promises.

A Step-by-Step Trace of the Code
Here's the code again:

JavaScript

const savePromises = categories.map(category => {
  const limit = parseFloat(budgets[category]) || 0;
  return api.post('/budgets', {
    category,
    limit,
    month: currentMonth
  });
});
Let's trace what happens for the first two categories in your list (['Food', 'Transport']).

Start:

The .map() method starts looping through the categories array.

Loop 1 (category = 'Food'):

The first item is 'Food'.

The code gets the limit for "Food" from your state: const limit = parseFloat(budgets['Food']) || 0; (Let's say the limit is 200).

The line return api.post('/budgets', ...) is executed.

Crucially, there is no await here. The code does not wait for the API call to complete. Instead, the api.post function immediately returns a Promise—a special object that represents a future, pending operation.

This Promise (the "sticky note" for the Food budget) becomes the first item in the savePromises array.

Loop 2 (category = 'Transport'):

The next item is 'Transport'.

It gets the limit for "Transport" from your state (e.g., 50).

It calls api.post(...) for the Transport budget.

This returns a second, separate Promise.

This second Promise is added to the savePromises array.

...the loop continues for all other categories.

The Final Result
After the .map() loop is finished, the savePromises variable is not a list of results, but a list of pending actions:

JavaScript

savePromises = [
  <Promise to save the 'Food' budget>,
  <Promise to save the 'Transport' budget>,
  <Promise to save the 'Bills' budget>,
  // ...and so on
]
You now have a complete "to-do list" of API calls ready to go.

The very next line in your code, await Promise.all(savePromises);, is what acts as the "starting pistol." It takes this entire array of promises and tells the browser to execute all of them at the same time (in parallel), waiting only until the very last one has finished. This is much more efficient than sending them one by one.

*/