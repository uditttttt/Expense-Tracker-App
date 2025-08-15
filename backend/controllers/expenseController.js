// backend/controllers/expenseController.js

const Expense = require("../models/Expense");

// @desc    Create a new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  const { description, amount, category } = req.body; // <-- Removed 'date'

  if (!description || !amount || !category) {
    // <-- Removed '!date'
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  try {
    const expense = await Expense.create({
      description,
      amount,
      category,
      // The date will be added by the model's default value
      user: req.user.id,
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all expenses for the logged-in user
// @route   GET /api/expenses
// @access  Private
// In backend/controllers/expenseController.js

// In backend/controllers/expenseController.js

// Replace your existing getExpenses function with this one
exports.getExpenses = async (req, res) => {
  try {
    const { category, dateRange, sortBy } = req.query; // NEW: Destructure sortBy
    
    const matchQuery = { user: req.user.id };

    if (category && category !== 'All') {
      matchQuery.category = category;
    }
    
    // ... (the date range logic remains exactly the same) ...
    if (dateRange && dateRange !== 'all_time') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let startDate;
      switch (dateRange) {
        case 'this_month':
          startDate = new Date(today.getFullYear(), today.getMonth(), 1);
          break;
        case 'last_month':
          startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
          const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
          matchQuery.date = { $gte: startDate, $lte: endOfLastMonth };
          break;
        case 'this_year':
          startDate = new Date(today.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(0);
      }
      if(dateRange !== 'last_month') {
        matchQuery.date = { $gte: startDate };
      }
    }

    // NEW: Logic to determine the sort order
    let sortQuery = { date: -1 }; // Default: Newest first
    switch (sortBy) {
      case 'date_asc':
        sortQuery = { date: 1 }; // Oldest first
        break;
      case 'amount_desc':
        sortQuery = { amount: -1 }; // High to Low
        break;
      case 'amount_asc':
        sortQuery = { amount: 1 }; // Low to High
        break;
    }

    const expenses = await Expense.find(matchQuery).sort(sortQuery); // UPDATED: Use the dynamic sortQuery

    res.status(200).json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an expense
// @route   PUT /api/expenses/:id
// @access  Private
// Make sure this function is defined and exported correctly
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Authorization Check: Ensure the logged-in user owns the expense
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // This option returns the updated document
    );

    res.status(200).json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete an expense
// @route   DELETE /api/expenses/:id
// @access  Private
// Make sure this function is defined and exported correctly
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Authorization check (same as update)
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id, message: "Expense removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add this new function to backend/controllers/expenseController.js

// @desc    Get expense summary for the logged-in user
// @route   GET /api/expenses/summary
// @access  Private
exports.getExpenseSummary = async (req, res) => {
  try {
    const today = new Date();
    // Get the first day of the current month
    //  Creates a new date object representing the very first moment of the current month (e.g., August 1, 2025, 00:00:00).
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // Get the first day of the next month
    //A clever way to get the end of the month. It creates a date object for the very first moment of the next month (e.g., September 1, 2025, 00:00:00).
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);


    //This is the command that starts the aggregation pipeline. Expense.aggregate() takes an array of "stages" that the data will pass through in order.
    const summary = await Expense.aggregate([
      {
        //This stage acts as a filter. It only allows documents that match these conditions to pass to the next stage.
        $match: {
          user: req.user._id, // Match expenses for the logged-in user
          date: { $gte: startOfMonth, $lt: endOfMonth }, // Match dates within the current month
        },
      },
      {

        //This stage takes all the documents that passed the $match filter and groups them to perform calculations.
        $group: {
          _id: null, // Group all matched documents together
          totalAmount: { $sum: "$amount" }, // Sum up the 'amount' field
          count: { $sum: 1 }, // Count the number of expenses
        },
      },
    ]);

    // If there are no expenses, the aggregation returns an empty array
    const result = summary[0] || { totalAmount: 0, count: 0 };
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add this new function to backend/controllers/expenseController.js

// @desc    Get expense summary by category for the current month
// @route   GET /api/expenses/category-summary
// @access  Private
exports.getCategorySummary = async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const summary = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lt: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category', // Group by the category field
          totalAmount: { $sum: '$amount' }, // Sum amounts for each category
        },
      },
      {
        $project: { // Reshape the output
          _id: 0,
          category: '$_id',
          totalAmount: '$totalAmount'
        }
      }
    ]);

    res.status(200).json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/*

Code Breakdown:

user: req.user.id: This is the most important line. Remember how our protect middleware found the user and attached them to the request object? This is where we use that information to link the new expense directly to the logged-in user

Code Breakdown:

Expense.find({ user: req.user.id }): This is the core of the function.

.find() is the Mongoose method to retrieve documents.

The object { user: req.user.id } is a query filter. It tells Mongoose: "Don't just give me all expenses; only give me the ones where the user field matches the ID of the user making this request."

.sort({ date: -1 }): This is an optional but very useful addition. It sorts the results by the date field in descending order (-1), ensuring the most recent expenses are always at the top of the list.

Code Breakdown:

Expense.findById(req.params.id): We first find the expense by the ID passed in the URL.

if (expense.user.toString() !== req.user.id): This is the crucial authorization check. We compare the user ID stored on the expense with the ID of the user making the request (from our protect middleware). If they don't match, we deny access with a 401 Unauthorized status.

Expense.findByIdAndUpdate(): This Mongoose method finds the document and updates it with the new data from req.body. The { new: true } option ensures it returns the modified document.

Code Breakdown:

The find and authorization logic is identical to the update function.

await Expense.findByIdAndDelete(req.params.id): This Mongoose method finds the matching document and removes it from the database.

We send back the ID of the deleted item so the frontend knows which one to remove from the display.

-----------------------------------------------------------

For total expense and total transactions

The "Factory Assembly Line" Analogy 🏭
Before we go line-by-line, think of the MongoDB Aggregation Pipeline as a factory assembly line.

Raw Materials: All the expense documents in your collection go in at the start.

Stage 1 ($match): The first worker on the line filters the documents, throwing away any that don't belong to the current user or aren't from this month.

Stage 2 ($group): The next worker takes all the approved documents, puts them in a single pile, and uses a calculator to add up their amounts and count them.

Final Product: A single summary document comes out at the end.

Code Breakdown
Lines 8-11: Date Calculations
const today = new Date();: Gets the current date and time.

const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);: Creates a new date object representing the very first moment of the current month (e.g., August 1, 2025, 00:00:00).

const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);: A clever way to get the end of the month. It creates a date object for the very first moment of the next month (e.g., September 1, 2025, 00:00:00).

Line 13: const summary = await Expense.aggregate([...]);
What it does: This is the command that starts the aggregation pipeline. Expense.aggregate() takes an array of "stages" that the data will pass through in order.

Lines 14-21: Stage 1 - The $match Stage
What it does: This stage acts as a filter. It only allows documents that match these conditions to pass to the next stage.

user: req.user._id: The expense's user field must match the ID of the logged-in user.

date: { $gte: startOfMonth, $lt: endOfMonth }: The expense's date must be:

$gte (Greater Than or Equal To) the start of the month.

$lt (Less Than) the start of the next month. This correctly includes all moments of the last day of the current month.

Why it's used: To ensure we are only calculating the summary for the correct user and the correct time period.

Lines 22-29: Stage 2 - The $group Stage
What it does: This stage takes all the documents that passed the $match filter and groups them to perform calculations.

_id: null: This is a special instruction that means "group all incoming documents into a single group." We aren't trying to group by category or anything else, we just want one grand total.

totalAmount: { $sum: '$amount' }: This creates a new field in the output called totalAmount. The $sum operator adds up the value of the amount field for every document in the group. The $ prefix on '$amount' means "the value from the amount field of the document."

count: { $sum: 1 }: This creates a new field called count. The $sum: 1 operator is a trick to count documents—for every document in the group, it adds 1 to the total.

Why it's used: This is the core calculation step. It summarizes all the filtered data into a single, useful result.

Lines 32-33: Handling the Result
JavaScript

const result = summary[0] || { totalAmount: 0, count: 0 };
res.status(200).json(result);
What it does: The Expense.aggregate method always returns an array.

If there were expenses that matched, the summary array will look like this: [{ _id: null, totalAmount: 157.50, count: 3 }].

If no expenses matched, the summary array will be empty: [].

The line summary[0] || { ... } handles this perfectly. It tries to get the first element (summary[0]). If summary[0] is undefined (because the array is empty), the || (OR) operator provides a default object with zero values.

Why it's used: To ensure your API always returns a predictable result object, even when there's no data. This prevents errors on the frontend. Finally, it sends this result back to the client.

Lines 35-38: catch (error) { ... }
This is the standard error handling block. If anything goes wrong with the database query, it logs the error for you and sends a generic 500 Server error message to the client.

-----------------------------------------------------------

For chart :

The "Factory Assembly Line" Analogy (Upgraded) 🏭
We can extend our factory analogy.

Stage 1 ($match): The first worker still filters for the correct user and month.

Stage 2 ($group): The second worker now has several bins. They sort all the incoming expenses into bins labeled "Food," "Transport," "Bills," etc., and then calculate the total for each bin separately.

Stage 3 ($project): A final worker at the end of the line takes each finished bin and sticks a new, cleaner label on it, renaming "_id" to "category" for clarity.

Code Breakdown
Lines 8-10: Date Calculations
What it does: This block is identical to your previous summary function. It calculates the startOfMonth and endOfMonth date objects to define the date range for the current month.

Line 12: const summary = await Expense.aggregate([...]);
What it does: This initiates the aggregation pipeline, which will process the expense documents in three sequential stages.

Lines 13-19: Stage 1 - The $match Stage
What it does: This stage is also identical to your previous summary function. It acts as a filter, only allowing documents that belong to the logged-in user (req.user._id) and fall within the current month's date range to pass to the next stage.

Lines 20-25: Stage 2 - The $group Stage
What it does: This is the first major change. This stage now groups the documents based on their category.

_id: '$category': This is the key instruction. Instead of grouping all documents into one (_id: null), this tells the pipeline to create a separate group for each unique value it finds in the category field.

totalAmount: { $sum: '$amount' }: This calculation is now performed for each category group individually. It sums up the amounts of all expenses within that group.

Why it's used: This is how you get a per-category breakdown instead of one grand total. The output of this stage will be an array of documents, one for each category, like:
[{ _id: 'Food', totalAmount: 250.75 }, { _id: 'Transport', totalAmount: 120.00 }]

Lines 26-33: Stage 3 - The $project Stage (New)
What it does: The $project stage is used to reshape or reformat the output documents from the previous stage.

_id: 0: This instruction means "do not include the _id field in the final output." We're getting rid of the _id field from the $group stage.

category: '$_id': This creates a new field in the output named category. Its value is taken from the _id field of the previous stage (which we know holds the category name). This effectively renames _id to category.

totalAmount: '$totalAmount': This includes the totalAmount field in the final output.

Why it's used: To make the final API response cleaner and more intuitive for the frontend to use. After this stage, the data from the example above is transformed into:
[{ category: 'Food', totalAmount: 250.75 }, { category: 'Transport', totalAmount: 120.00 }]

Line 36: res.status(200).json(summary);
What it does: It sends the final summary array, which now contains the neatly formatted category totals, back to the client with a 200 OK status.

Lines 37-40: catch (error) { ... }
What it does: The standard error handling block. If anything goes wrong in the aggregation pipeline, it logs the error for you and sends a generic 500 Server error to the client.

*/