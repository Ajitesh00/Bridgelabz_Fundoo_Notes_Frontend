'use client';

import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import { signin } from '../services/user.service';

type State = {
  email: string;
  password: string;
  showPassword: boolean;
  snackbarOpen: boolean;
  snackbarMessage: string;
};

export default class SigninForm extends Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      snackbarOpen: false,
      snackbarMessage: '',
    };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const data = { email: this.state.email, password: this.state.password };
  try {
    const response = await signin(data);
    const { code, message, data: responseData } = response.data;

    console.log(`Received response - Code: ${code}, Message: ${message}, Data:`, responseData);

    this.setState({
      snackbarOpen: true,
      snackbarMessage: message,
    });

    switch (code) {
      case 200:
        console.log('Login successful:', responseData);
        // Example: Store token in localStorage
        localStorage.setItem('token', responseData.token);
        // Optionally redirect to a dashboard
        // window.location.href = '/dashboard';
        break;
      case 401:
        console.log('Invalid Password:', responseData);
        break;
      case 404:
        console.log('User not found:', responseData);
        break;
      case 500:
        console.log('Server error:', responseData);
        break;
      default:
        console.log('Unexpected status code:', code, responseData);
        this.setState({
          snackbarOpen: true,
          snackbarMessage: 'Unexpected error occurred. Please try again.',
        });
    }
  } catch (error: any) {
    console.error('API call failed:', error.response ? error.response.data : error.message);
    this.setState({
      snackbarOpen: true,
      snackbarMessage: 'Network error or server unreachable. Please try again.',
    });
  }
};

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  togglePasswordVisibility = () => {
    this.setState(prevState => ({
      showPassword: !prevState.showPassword,
    }));
  };

  render() {
    const { email, password, showPassword, snackbarOpen, snackbarMessage } = this.state;

    return (
      <div className="p-10 bg-white rounded-md shadow-md max-w-2xl mx-auto flex flex-col items-center">
        <form onSubmit={this.handleSubmit} className="w-full flex flex-col items-center">
          <img src="google.png" alt="Google Logo" className="w-25 mb-4" />
          <h1 className="text-3xl mb-4">Sign in</h1>
          <p className="text-gray-600 mb-12">Use your Google Account</p>
          <TextField
            name="email"
            label="Email or phone"
            variant="outlined"
            value={email}
            onChange={this.handleChange}
            fullWidth
            className="mb-4"
          />
          <div className="relative mb-4 mt-4 w-full">
            <TextField
              name="password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              variant="outlined"
              value={password}
              onChange={this.handleChange}
              fullWidth
            />
            <img
              src="eye.svg"
              alt="Toggle password visibility"
              className="w-6 h-6 cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={this.togglePasswordVisibility}
            />
          </div>
          <Link className="text-blue-600 w-full cursor-pointer">Forgot password?</Link>
          <p className="text-gray-500 text-sm mt-10">
            Not your computer? Use a Private Window to sign in.{' '}
            <Link className="text-blue-600 cursor-pointer">Learn more</Link>
          </p>
          <div className="flex justify-between w-full mb-4 mt-10">
            <Button variant="contained" color="primary" href="/signup" className="w-1/2.5 h-12">
              Create account
            </Button>
            <Button type="submit" variant="contained" color="primary" className="w-1/4 h-12">
              Next
            </Button>
          </div>
        </form>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={this.handleSnackbarClose}
          message={snackbarMessage}
          key="bottom-center"
        />
      </div>
    );
  }
}