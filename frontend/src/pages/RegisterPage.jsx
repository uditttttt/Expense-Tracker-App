import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false); // NEW: Added loading state
    const navigate = useNavigate();
    const { name, email, password } = formData;

    const handleChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Creating account...');

        try {
            // UPDATED: Corrected the API endpoint to '/auth/register'
            await api.post('/auth/register', { name, email, password });
            toast.success('Registration successful! Please log in.', { id: loadingToast });
            navigate('/login');
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message, { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100 sm:px-6 lg:px-8">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-900">
                    Create an Account
                </h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm form-input focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            placeholder="Your Name"
                        />
                    </div>

                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm form-input focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password Field with Toggle */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                                required
                                minLength="6"
                                disabled={loading}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm form-input focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 font-semibold text-white transition duration-300 bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </div>
                </form>

                {/* Link to Login Page */}
                <p className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-500"
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

/*

Code Breakdown:

useState: We use a single state object, formData, to keep track of the values in all our input fields.

handleChange: This smart function updates the correct piece of state based on the name attribute of the input field that's being changed. This lets us use one function for all three inputs.

handleSubmit: For now, this function just logs the form data to your browser's console. Later, we'll add our API call here.

Tailwind CSS: The className attributes provide all the styling for a clean, modern, and responsive form without writing any custom CSS.

Link: The <Link to="/login"> component from react-router-dom creates a seamless, client-side link to the login page.

The ...prevState syntax is used to preserve all the other unchanged form fields while you update only the one that the user is currently typing in. Without it, every time you typed in the email field, the name and password fields would be erased.

Code Breakdown:

We import useNavigate from react-router-dom to allow us to programmatically redirect the user after a successful registration.

We import our new api service.

The handleSubmit function is now async because API calls are asynchronous.

try...catch block: This is for handling the request.

try: We call api.post('/auth/register', formData). axios automatically converts our formData state object into JSON for the request body. If the registration is successful, we show an alert and use Maps('/login') to send the user to the login page.

catch: If our backend returns an error (like "User already exists"), axios will throw an error. We catch it here and display the specific error message from our backend (error.response.data.message) in an alert.


*/