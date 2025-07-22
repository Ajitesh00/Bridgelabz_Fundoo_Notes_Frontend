'use client';

import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import './signup.css';

type State = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  passwordError: boolean;
  showPassword: boolean;
};

export default function SignupForm() {
  const [state, setState] = useState<State>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordError: false,
    showPassword: false,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    // Delay initial check to ensure window is available
    const timer = setTimeout(() => {
      handleResize();
    }, 0);
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { password, confirmPassword } = state;
    if (password.length < 8 || password !== confirmPassword) {
      setState(prevState => ({ ...prevState, passwordError: true }));
      return;
    }
    setState(prevState => ({ ...prevState, passwordError: false }));
    console.log(state);
  };

  const togglePasswordVisibility = () => {
    const { password, confirmPassword } = state;
    if (password || confirmPassword) {
      setState(prevState => ({
        ...prevState,
        showPassword: !prevState.showPassword,
      }));
    }
  };

  if (isMobile) {
    return (
      
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white rounded-md shadow-md max-w-xs mx-auto flex flex-col items-center"
      >
        <div className="w-full">
          <img src="google.png" alt="Google Logo" className="w-16 mb-2" />
          <h1 className="font-bold text-xl mb-4 whitespace-nowrap">Create your Google Account</h1>
          <TextField
            name="firstName"
            label="First name"
            variant="outlined"
            value={state.firstName}
            onChange={handleChange}
            fullWidth
            // className="mb-4" // Increased spacing
            className="textfield"
          />
          <TextField
            name="lastName"
            label="Last name"
            variant="outlined"
            value={state.lastName}
            onChange={handleChange}
            fullWidth
            className="textfield"
          />
          <TextField
            name="email"
            label="Username"
            variant="outlined"
            value={state.email}
            onChange={handleChange}
            fullWidth
            InputProps={{
              endAdornment: <span className="ml-2 text-gray-500">@gmail.com</span>,
            }}
            helperText="You can use letters, numbers & periods"
            className="textfield"
          />
          <div className="flex justify-center gap-2 mb-4 mt-2 w-full">
            <div className="flex items-center flex-1">
              <TextField
                name="password"
                type={state.showPassword && (state.password || state.confirmPassword) ? 'text' : 'password'}
                label="Password"
                variant="outlined"
                value={state.password}
                onChange={handleChange}
                fullWidth
                className="flex-1"
                error={state.passwordError}
                helperText={state.passwordError ? "Use 8 or more characters with a mix of letters, numbers & symbols" : ""}
              />
            </div>
            <div className="flex items-center flex-1">
              <TextField
                name="confirmPassword"
                type={state.showPassword && (state.password || state.confirmPassword) ? 'text' : 'password'}
                label="Confirm"
                variant="outlined"
                value={state.confirmPassword}
                onChange={handleChange}
                fullWidth
                className="flex-1"
                error={state.passwordError}
                helperText={state.passwordError ? "Passwords must match and be at least 8 characters" : ""}
              />
            </div>
            <div className="flex items-center">
              <img
                src="eye.svg"
                alt="Toggle password visibility"
                className="w-6 h-6 cursor-pointer"
                onClick={togglePasswordVisibility}
              />
            </div>
          </div>
          <div className="flex justify-between items-center w-full">
            <Link href="/signin" className="text-blue-600">
              Sign in instead
            </Link>
            <Button type="submit" variant="contained" color="primary" className="w-16 h-8">
              Next
            </Button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-12 bg-white rounded-md shadow-md max-w-3xl mx-auto flex flex-row gap-18"
    >
      <div className="flex-1">
        <img src="google.png" alt="Google Logo" className="w-22 mb-2" />
        <h1 className="font-bold text-3xl mb-6 whitespace-nowrap">Create your Google Account</h1>
        <div className="flex gap-4 mb-8">
          <TextField
            name="firstName"
            label="First name"
            variant="outlined"
            value={state.firstName}
            onChange={handleChange}
            fullWidth
            className="flex-1"
          />
          <TextField
            name="lastName"
            label="Last name"
            variant="outlined"
            value={state.lastName}
            onChange={handleChange}
            fullWidth
            className="flex-1"
          />
        </div>
        <TextField
          name="email"
          label="Username"
          variant="outlined"
          value={state.email}
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: <span className="ml-2 text-gray-500">@gmail.com</span>,
          }}
          helperText="You can use letters, numbers & periods"
          className="mb-4"
        />
        <div className="flex justify-center gap-4 mb-4 mt-4">
          <div className="flex items-center flex-1">
            <TextField
              name="password"
              type={state.showPassword && (state.password || state.confirmPassword) ? 'text' : 'password'}
              label="Password"
              variant="outlined"
              value={state.password}
              onChange={handleChange}
              fullWidth
              className="flex-1"
              error={state.passwordError}
              helperText={state.passwordError ? "Use 8 or more characters with a mix of letters, numbers & symbols" : ""}
            />
          </div>
          <div className="flex items-center flex-1">
            <TextField
              name="confirmPassword"
              type={state.showPassword && (state.password || state.confirmPassword) ? 'text' : 'password'}
              label="Confirm"
              variant="outlined"
              value={state.confirmPassword}
              onChange={handleChange}
              fullWidth
              className="flex-1"
              error={state.passwordError}
              helperText={state.passwordError ? "Passwords must match and be at least 8 characters" : ""}
            />
          </div>
          <div className="flex items-center">
            <img
              src="eye.svg"
              alt="Toggle password visibility"
              className="w-6 h-6 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link href="/signin" className="text-blue-600">
            Sign in instead
          </Link>
          <Button type="submit" variant="contained" color="primary" className="w-20 h-10">
            Next
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <img src="new.png" alt="Google Services" className="w-48 h-52 mb-4" />
        <p className="text-center text-gray-600">One account. All of Google working for you.</p>
      </div>
    </form>
  );
}