'use client';

import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { register } from '../services/user.service';
import './signup.css';

// Define form state structure
type State = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  passwordError: boolean; // Track password validation errors
  showPassword: boolean;  // Toggle password visibility
};

// FUNCTIONAL COMPONENT - Google-style signup form with responsive design
export default function SignupForm() {
  // Main form state
  const [formData, setFormData] = useState<State>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordError: false,
    showPassword: false,
  });
  
  // Track screen size for responsive layout
  const [isMobile, setIsMobile] = useState(false);
  
  // Notification state for success/error messages
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  
  const router = useRouter();

  // Set up responsive layout detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480); // Mobile breakpoint
    };
    
    // Initial check with delay to ensure window is loaded
    const timer = setTimeout(() => {
      handleResize();
    }, 0);
    
    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    
    // Cleanup on component unmount
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle input field changes (firstName, lastName, email, password, confirmPassword)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value, // Dynamically update field based on input name
    }));
  };

  // Handle form submission and registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    const { password, confirmPassword, firstName, lastName, email } = formData;
    
    // If password is filled, validate that required fields are also filled
    if (password && (!firstName.trim() || !lastName.trim() || !email.trim())) {
      const missingFields = [];
      if (!firstName.trim()) missingFields.push('First name');
      if (!lastName.trim()) missingFields.push('Last name');
      if (!email.trim()) missingFields.push('Username');
      
      setSnackbar({
        open: true,
        message: `Please fill in the following required fields: ${missingFields.join(', ')}`,
        severity: 'error',
      });
      return;
    }
    
    // Validate password requirements
    if (password.length < 8 || password !== confirmPassword) {
      setFormData(prevState => ({ ...prevState, passwordError: true }));
      setSnackbar({
        open: true,
        message: 'Passwords must match and be at least 8 characters',
        severity: 'error',
      });
      return;
    }
    
    // Reset password error if validation passes
    setFormData(prevState => ({ ...prevState, passwordError: false }));

    try {
      // Call registration API
      const response = await register({ firstName, lastName, email, password });
      
      if (response.data.code === 201) {
        // Registration successful
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: 'success',
        });
        // Redirect to signin page after 2 seconds
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      } else {
        // Registration failed with error message
        setSnackbar({
          open: true,
          message: response.data.message || 'Registration failed',
          severity: 'error',
        });
      }
    } catch (error) {
      // Handle network errors or API failures
      setSnackbar({
        open: true,
        message: 'Something went wrong during registration',
        severity: 'error',
      });
    }
  };

  // Toggle password visibility (only if password fields have content)
  const togglePasswordVisibility = () => {
    const { password, confirmPassword } = formData;
    if (password || confirmPassword) {
      setFormData(prevState => ({
        ...prevState,
        showPassword: !prevState.showPassword,
      }));
    }
  };

  // Close notification snackbar
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Responsive form with conditional rendering
  return (
  <>
    <form
      onSubmit={handleSubmit}
      className={`
        bg-white rounded-md shadow-md mx-auto flex items-center
        ${isMobile 
          ? 'p-4 max-w-xs flex-col'  // Mobile: smaller padding, single column
          : 'pl-12 pr-12 pt-8 pb-8 max-w-3xl flex-row gap-18' // Desktop: larger padding, two columns
        }
      `}
    >
      {/* Main form content */}
      <div className={isMobile ? "w-full" : "flex-1"}>
        {/* Header section with logo and title */}
        <img 
          src="google.png" 
          alt="Google Logo" 
          className={isMobile ? "w-16 mb-2" : "w-22 mb-2"} 
        />
        <h1 className={`font-bold mb-4 whitespace-nowrap ${
          isMobile ? "text-xl mb-4" : "text-3xl mb-6"
        }`}>
          Create your Google Account
        </h1>

        {/* Name fields - responsive layout */}
        <div className={`${isMobile ? "" : "flex gap-4 mb-8"}`}>
          <TextField
            name="firstName"
            label="First name"
            variant="outlined"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            className={`${isMobile ? "textfield" : "flex-1"}`}
          />
          <TextField
            name="lastName"
            label="Last name"
            variant="outlined"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            className={`${isMobile ? "textfield" : "flex-1"}`}
          />
        </div>

        {/* Email/Username field with @gmail.com suffix */}
        <TextField
          name="email"
          label="Username"
          variant="outlined"
          value={formData.email}
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: <span className="ml-2 text-gray-500">@gmail.com</span>,
          }}
          helperText="You can use letters, numbers & periods"
          className={isMobile ? "textfield" : "mb-4"}
        />

        {/* Password fields with visibility toggle */}
        <div className={`flex justify-center gap-${isMobile ? '2' : '4'} mb-4 ${
          isMobile ? 'mt-2' : 'mt-4'
        } w-full`}>
          <div className="flex items-center flex-1">
            <TextField
              name="password"
              type={formData.showPassword && (formData.password || formData.confirmPassword) ? 'text' : 'password'}
              label="Password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              className="flex-1"
              error={formData.passwordError}
              helperText={formData.passwordError ? "Use 8 or more characters with a mix of letters, numbers & symbols" : ""}
            />
          </div>
          <div className="flex items-center flex-1">
            <TextField
              name="confirmPassword"
              type={formData.showPassword && (formData.password || formData.confirmPassword) ? 'text' : 'password'}
              label="Confirm"
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              className="flex-1"
              error={formData.passwordError}
              helperText={formData.passwordError ? "Passwords must match and be at least 8 characters" : ""}
            />
          </div>
          {/* Eye icon for password visibility toggle */}
          <div className="flex items-center">
            <img
              src="eye.svg"
              alt="Toggle password visibility"
              className="w-6 h-6 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>

        {/* Footer with navigation and submit button */}
        <div className="flex justify-between items-center w-full">
          <Link href="/signin" className="text-blue-600">
            Sign in instead
          </Link>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            className={isMobile ? "w-16 h-8" : "w-20 h-10"}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Side illustration - only show on desktop */}
      {!isMobile && (
        <div className="flex-1 flex flex-col justify-center items-center">
          <img src="new.png" alt="Google Services" className="w-48 h-52 mb-4" />
          <p className="text-center text-gray-600">One account. All of Google working for you.</p>
        </div>
      )}
    </form>

    {/* Notification snackbar for success/error messages */}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000} // Auto-hide after 6 seconds
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  </>
);
}