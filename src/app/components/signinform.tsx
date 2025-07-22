'use client';

import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { signin } from '../services/user.service';

// Define component state structure
type State = {
  email: string;
  password: string;
  showPassword: boolean;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error';
};

// CLASS COMPONENT - Google-style sign-in form
export default class SigninForm extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    // Initialize component state
    this.state = {
      email: '',
      password: '',
      showPassword: false, // Controls password visibility toggle
      snackbarOpen: false, // Controls notification display
      snackbarMessage: '',
      snackbarSeverity: 'success',
    };
  }

  // Handle input field changes (email, password)
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: value, // Dynamically update the field based on input name
    }));
  };

  // Handle form submission and API call
  handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault(); // Prevent default form submission
  const data = { email: this.state.email, password: this.state.password };
  
  try {
    // Make API call to signin service
    const response = await signin(data);
    const { code, message, data: responseData } = response.data;

    console.log(`Received response - Code: ${code}, Message: ${message}, Data:`, responseData);

    // Handle different response codes
    switch (code) {
      case 200: // Success
        // Show success message to user
        this.setState({
          snackbarOpen: true,
          snackbarMessage: message,
          snackbarSeverity: 'success',
        });
        // Store authentication token
        localStorage.setItem('token', responseData.token);
        // Redirect to dashboard on successful login
        window.location.href = '/dashboard';
        break;
      case 401: // Unauthorized - wrong password
      case 404: // User not found
      case 500: // Server error
        // Show error message to user
        this.setState({
          snackbarOpen: true,
          snackbarMessage: message,
          snackbarSeverity: 'error',
        });
        break;
      default: // Unexpected error
        console.log('Unexpected status code:', code, responseData);
        this.setState({
          snackbarOpen: true,
          snackbarMessage: 'Unexpected error occurred. Please try again.',
          snackbarSeverity: 'error',
        });
    }
  } catch (error: any) {
    // Handle network errors or API failures
    console.error('API call failed:', error.response ? error.response.data : error.message);
    this.setState({
      snackbarOpen: true,
      snackbarMessage: 'Network error or server unreachable. Please try again.',
      snackbarSeverity: 'error',
    });
  }
};

  // Close notification snackbar
  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  // Toggle password visibility (show/hide)
  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }));
  };

  render() {
    const { email, password, showPassword, snackbarOpen, snackbarMessage, snackbarSeverity } = this.state;

    return (
      <div className="p-10 bg-white rounded-md shadow-md max-w-2xl mx-auto flex flex-col items-center">
        <form onSubmit={this.handleSubmit} className="w-full flex flex-col items-center">
          {/* Google logo */}
          <img src="google.png" alt="Google Logo" className="w-25 mb-4" />
          
          {/* Form header */}
          <h1 className="text-3xl mb-4">Sign in</h1>
          <p className="text-gray-600 mb-12">Use your Google Account</p>
          
          {/* Email input field */}
          <TextField
            name="email"
            label="Email or phone"
            variant="outlined"
            value={email}
            onChange={this.handleChange}
            fullWidth
            className="mb-4"
          />
          
          {/* Password input with visibility toggle */}
          <div className="relative mb-4 mt-4 w-full">
            <TextField
              name="password"
              type={showPassword ? 'text' : 'password'} // Toggle between text and password
              label="Password"
              variant="outlined"
              value={password}
              onChange={this.handleChange}
              fullWidth
            />
            {/* Eye icon to toggle password visibility */}
            <img
              src="eye.svg"
              alt="Toggle password visibility"
              className="w-6 h-6 cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={this.togglePasswordVisibility}
            />
          </div>
          
          {/* Forgot password link */}
          <Link className="text-blue-600 w-full cursor-pointer">Forgot password?</Link>
          
          {/* Privacy notice */}
          <p className="text-gray-500 text-sm mt-10">
            Not your computer? Use a Private Window to sign in.{' '}
            <Link className="text-blue-600 cursor-pointer">Learn more</Link>
          </p>
          
          {/* Action buttons */}
          <div className="flex justify-between w-full mb-4 mt-10">
            {/* Create account button */}
            <Button variant="contained" color="primary" href="/signup" className="w-1/2.5 h-12">
              Create account
            </Button>
            {/* Submit button */}
            <Button type="submit" variant="contained" color="primary" className="w-1/4 h-12">
              Next
            </Button>
          </div>
        </form>
        
        {/* Notification snackbar for messages */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000} // Auto-hide after 6 seconds
          onClose={this.handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={this.handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    );
  }
}