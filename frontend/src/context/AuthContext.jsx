import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

// This is the "information desk" itself
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function runs when the app loads to check if a user is already logged in.
    async function loadUserFromToken() {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Set the token in the default headers for all future api requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Fetch user data with the token
          const { data } = await api.get('/auth/me');
          setUser(data);
        } catch (error) {
          console.error('Failed to load user from token', error);
          // If token is invalid, remove it
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    }

    loadUserFromToken();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}> {/* Add setUser here */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

/*

## Core Concept: React Context API
Think of the Context API as a global announcement system for your app. Instead of passing user information down through many layers of components (called "prop drilling"), we can create a central "AuthContext" that holds the user's status. Any component that needs this information can simply subscribe to it.

It's late, but you're tackling one of the most important concepts in a React application: global state management for authentication. This AuthContext file creates a central "hub" for user information that any component in your app can access without passing props down through many layers.

Think of it as your app's central information desk. Any component can walk up to this desk to ask, "Who is currently logged in?" or "Is anyone logged in at all?"

Code Breakdown:

useEffect: This is the most important part. When our app first loads, this code checks localStorage for a token. If it finds one, it automatically sets it as the authorization header for axios and makes a call to our /api/auth/me endpoint to get the user's data. This is how your app "remembers" you when you refresh the page.

logout: This function clears the user's session by removing the token and user data.

AuthContext.Provider: This component makes the user, loading, and logout values available to every other component wrapped inside it.

The Setup
Line 1: import { createContext, useState, useEffect } from 'react';
What it does: Imports three essential React Hooks:

createContext: The function used to create the context object itself (the "information desk").

useState: To create and manage state variables (like user and loading).

useEffect: To run side effects, like fetching data from an API when the component first loads.

Why it's used: These are the core building blocks from React needed to create this global state provider.

Line 2: import api from '../services/api';
What it does: Imports your pre-configured Axios instance.

Why it's used: To make API calls to your backend to verify the token and fetch user data.

Line 4: const AuthContext = createContext();
What it does: This line actually creates the context. AuthContext is now an object with two main components: a Provider and a Consumer. You will primarily use the Provider.

Why it's used: This is the "information desk" itself. We will wrap our application with its Provider part to make the authentication data available everywhere.

The AuthProvider Component
This component is the heart of the file. Its job is to manage all the authentication state and logic and provide it to the rest of the app.

Line 6: export const AuthProvider = ({ children }) => {
What it does: Defines a React component named AuthProvider. It accepts a special prop called children.

Why it's used: children represents any other components that you wrap inside <AuthProvider>. This allows the provider to share its state with your entire application.

Lines 7-8: The State Variables
const [user, setUser] = useState(null);: This state holds the authenticated user's data. It's initialized to null because when the app first loads, we don't know if anyone is logged in.

const [loading, setLoading] = useState(true);: This is a crucial loading state. It's initialized to true. Its purpose is to track whether the initial "check for a logged-in user" process is complete.

Line 10: useEffect(() => { ... }, []);
What it does: This useEffect hook runs a function. The empty dependency array [] at the end is very important: it tells React to run this effect only once, right after the component first renders (i.e., when your application starts).

Why it's used: This is the perfect place to check if a user already has a valid token in localStorage from a previous session.

Line 12: async function loadUserFromToken() { ... }
What it does: An async function defined inside the useEffect hook.

Why it's used: To contain the logic for checking the token and fetching user data, allowing the use of await for the API call.

Line 13: const token = localStorage.getItem('token');
What it does: It retrieves the JWT from the browser's localStorage. If no token exists, this will be null.

Line 15: if (token) {
What it does: This block only runs if a token was found in storage.

Line 17: api.defaults.headers.common['Authorization'] = \Bearer ${token}`;`
What it does: This is a key line. It sets the Authorization header on the default configuration of your Axios api instance.

Why it's used: This ensures that all subsequent API calls made with this api instance will automatically include the user's token. This is an alternative to the "interceptor" method we discussed earlier and is very effective.

Line 19: const { data } = await api.get('/auth/me');
What it does: It makes a GET request to your /api/auth/me endpoint. Because the header was set in the previous step, this request is authenticated. It waits for the response and destructures the data (the user object) from it.

Why it's used: To verify that the token is still valid and to fetch the full user details associated with that token.

Line 20: setUser(data);
What it does: If the API call was successful, it updates the user state with the data received from the backend. The app now knows who is logged in.

Lines 21-25: catch (error) { ... }
What it does: If the api.get call fails (e.g., the token is expired or invalid), this block runs. It logs the error and, importantly, removes the bad token from localStorage.

Why it's used: To clean up invalid tokens and prevent errors on future visits.

Line 27: setLoading(false);
What it does: This line runs whether a token was found or not. It sets the loading state to false.

Why it's used: To signal that the initial authentication check is complete.

Line 32: const logout = () => { ... }
What it does: Defines a logout function.

Why it's used: This function can be called from anywhere in the app (e.g., a "Logout" button in a navbar) to log the user out. It cleans up everything: removes the token from localStorage, clears the user state in React, deletes the default Authorization header from Axios, and redirects the user to the login page.

Line 41: return (
This is the JSX that the AuthProvider component renders.

Line 42: <AuthContext.Provider value={{ user, setUser, loading, logout }}>
What it does: This uses the Provider part of our AuthContext. It makes everything inside the value prop available to any child component that wants it.

Why it's used: This is how the global state is shared. We are sharing the user data, the setUser function, the loading state, and the logout function.

Line 43: {!loading && children}
What it does: This is a very clever and important piece of conditional rendering. It means: "If loading is not true, then render the children (the rest of your app)."

Why it's used: This prevents your main application from rendering until the initial useEffect check is finished. It solves a common UI problem: without it, the app might briefly show a logged-out state (like a login page) before quickly switching to the logged-in state (the dashboard), causing a jarring "flicker." This line ensures the user sees a blank screen (or a loading spinner, if you add one) until the authentication status is confirmed.

Line 48: export default AuthContext;
What it does: Exports the AuthContext object itself.

Why it's used: So other components can import it and use the useContext hook to access the shared data (e.g., const { user } = useContext(AuthContext);).

Why loadUserFromToken() is Called Inside useEffect
The main useEffect function itself cannot be async.

An async function always returns a Promise, but useEffect expects its return value to either be nothing or a "cleanup" function. React would get confused if it received a Promise.

So, the standard and cleanest way to run an async operation inside a useEffect that runs only once is to use this pattern:

Define a separate async function inside useEffect. We named ours loadUserFromToken to make the code readable and clear about its purpose.

JavaScript

useEffect(() => {
  // 1. Define the async logic here
  async function loadUserFromToken() {
    // ... all the async logic
  }

  // ...
}, []);
Call that function immediately. After defining it, you simply call it on the next line to execute it.

JavaScript

useEffect(() => {
  async function loadUserFromToken() {
    // ...
  }

  // 2. Execute the function
  loadUserFromToken(); 
}, []);
In short, it's a clean and safe pattern that allows you to use async/await inside useEffect without causing issues.

The Use of the logout Function
The logout function is a "cleanup crew". Its job is to completely erase all traces of the user's session from the frontend application, ensuring they are fully and securely logged out.

Each line in the function handles a different part of the cleanup:

localStorage.removeItem('token');
What it does: Removes the token from the browser's persistent storage.

Why it's important: This is the most crucial step. If you don't remove the token, the user would still be considered "logged in" the next time they open the app. This erases their "key card."

setUser(null);
What it does: It updates the user state inside your React application back to null.

Why it's important: This immediately triggers a re-render of your components. Any component that depends on the user data will now see that the user is gone and will switch to a logged-out view (e.g., a navbar might change from showing "Welcome, Rohan" to showing a "Login" button).

delete api.defaults.headers.common['Authorization'];
What it does: It removes the default Authorization header from your Axios instance.

Why it's important: This is the opposite of what you did when the user logged in. It ensures that any future API calls made by the app (even by accident right after logout) will not include the old, now-invalid token. It's a thorough security cleanup.

window.location.href = '/login';
What it does: This forces a full browser redirect to the /login page.

Why it's important: This provides a clean slate and a clear user experience, immediately taking the user to the login screen and resetting the state of the entire application.

*/