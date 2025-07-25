"use client";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import AppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import RefreshOutlined from '@mui/icons-material/RefreshOutlined';
import ViewAgendaOutlined from '@mui/icons-material/ViewAgendaOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import AppsRounded from '@mui/icons-material/AppsRounded';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';

const drawerWidth = 240;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  backgroundColor: '#f1f3f4',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
  marginLeft: `${theme.spacing(10)} !important`,
  marginRight: theme.spacing(2),
  display: 'flex',
  flex: '0 0 700px',
  height: '50px',
  [theme.breakpoints.up('sm')]: {
    marginLeft: `${theme.spacing(10)} !important`,
    flex: '0 0 700px',
    height: '50px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 3),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  left: 0,
  zIndex: 3,
  width: theme.spacing(4),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  flexGrow: 1,
  '& .MuiInputBase-input': {
    padding: `${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(6)} !important`,
    width: '100% !important',
    height: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: 2,
    borderRadius: (theme.shape.borderRadius as number) * 2,
    '&:focus': {
      outline: 'none',
      backgroundColor: '#e0e0e0',
      borderRadius: (theme.shape.borderRadius as number) * 2,
    },
    '&::placeholder': {
      paddingLeft: 0,
    },
  },
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 2,
  position: 'fixed',
  width: '100%',
  backgroundColor: '#ffffff',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
}));

interface PrimarySearchAppBarProps {
  open: boolean;
  onDrawerToggle: () => void;
  onSearch: (query: string) => void;
}

export default function PrimarySearchAppBar({ open, onDrawerToggle, onSearch }: PrimarySearchAppBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [userEmail, setUserEmail] = React.useState<string>('');
  const [userInitial, setUserInitial] = React.useState<string>('');

  // Access localStorage only on client-side
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('userEmail') || '';
      setUserEmail(email);
      setUserInitial(email ? email.charAt(0).toUpperCase() : '');
    }
  }, []);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
    }
    setAnchorEl(null);
    window.location.href = '/signin';
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="fixed" color="inherit">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="default"
            aria-label="toggle drawer"
            onClick={onDrawerToggle}
            sx={(theme) => ({ mr: 2, zIndex: theme.zIndex.drawer + 3 })}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="keep icon"
          >
            <img src="/keep.png" alt="Keep Icon" style={{ width: 34, height: 36 }} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, color: 'gray', mr: 2, fontSize: '1.5rem' }}
          >
            Keep
          </Typography>
          <Search>
            <SearchIconWrapper sx={{ color: '#5f6368' }}>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="large" sx={{ color: '#5f6368' }} aria-label="refresh">
            <RefreshOutlined />
          </IconButton>
          <IconButton size="large" sx={{ color: '#5f6368' }} aria-label="view list">
            <ViewAgendaOutlined />
          </IconButton>
          <IconButton size="large" sx={{ mr: 4, color: '#5f6368' }} aria-label="settings">
            <SettingsOutlined />
          </IconButton>
          <IconButton size="large" sx={{ color: '#5f6368' }} aria-label="apps">
            <AppsRounded />
          </IconButton>
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ marginLeft: 1 }}
          >
            <Avatar sx={{ bgcolor: blue[500], width: 32, height: 32, fontSize: '1rem' }}>
              {userInitial}
            </Avatar>
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      {renderMenu}
    </Box>
  );
}