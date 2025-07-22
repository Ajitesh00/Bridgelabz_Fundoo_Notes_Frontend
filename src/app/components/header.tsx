"use client";

import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
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
import AccountCircle from '@mui/icons-material/AccountCircle';
import RefreshOutlined from '@mui/icons-material/RefreshOutlined';
import ViewAgendaOutlined from '@mui/icons-material/ViewAgendaOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import AppsRounded from '@mui/icons-material/AppsRounded';

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
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface PrimarySearchAppBarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

export default function PrimarySearchAppBar({ open, handleDrawerOpen }: PrimarySearchAppBarProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
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
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="fixed" color="inherit" open={open} sx={{ backgroundColor: '#ffffff', boxShadow: 'none' }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="default"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
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
            <AccountCircle sx={{ borderRadius: '50%', width: 32, height: 32, color: '#5f6368' }} />
          </IconButton>
        </Toolbar>
      </StyledAppBar>
      {renderMenu}
    </Box>
  );
}