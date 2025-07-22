"use client";

import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined';
import NotificationsOutlined from '@mui/icons-material/NotificationsOutlined';
import LabelOutlined from '@mui/icons-material/LabelOutlined';
import ArchiveOutlined from '@mui/icons-material/ArchiveOutlined';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    className: 'sidenav',
    '& .MuiDrawer-paper': {
      className: 'sidenav-paper',
      borderColor: 'transparent',
      borderRightWidth: 0, // Explicitly remove right border
      ...(!open && {
        borderWidth: 0,
      }),
    },
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
    zIndex: theme.zIndex.drawer + 1, // Below header
  }),
);

interface MiniDrawerProps {
  open: boolean;
  onDrawerToggle: () => void;
  onViewChange: (view: 'notes' | 'archive' | 'trash') => void;
  currentView: 'notes' | 'archive' | 'trash';
  activeItem?: string;
}

export default function MiniDrawer({ open, onDrawerToggle, onViewChange, currentView, activeItem }: MiniDrawerProps) {
  const theme = useTheme();

  return (
    <Drawer variant="permanent" open={open}>
      <List sx={{ pt: theme.spacing(8) }}>
        {[
          { text: 'Notes', icon: <LightbulbOutlined />, view: 'notes' },
          { text: 'Reminders', icon: <NotificationsOutlined />, view: 'notes' },
          { text: 'Labels', icon: <LabelOutlined />, view: 'notes' },
          { text: 'Archive', icon: <ArchiveOutlined />, view: 'archive' },
          { text: 'Trash', icon: <DeleteOutlined />, view: 'trash' },
        ].map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              sx={[
                {
                  minHeight: 48,
                  px: 2.5,
                  borderTopRightRadius: 30,
                  borderBottomRightRadius: 30,
                  backgroundColor:
                    (currentView === item.view && (item.view !== 'notes' || item.text === 'Notes'))
                      ? 'rgba(251, 188, 4, 0.7)'
                      : activeItem === item.text
                      ? 'rgba(0, 0, 0, 0.08)'
                      : 'transparent',
                  '&:hover': {
                    backgroundColor:
                      (currentView === item.view && (item.view !== 'notes' || item.text === 'Notes'))
                        ? 'rgba(251, 188, 4, 0.7)'
                        : 'rgba(0, 0, 0, 0.04)',
                  },
                },
                open
                  ? {
                      justifyContent: 'initial',
                    }
                  : {
                      justifyContent: 'center',
                    },
              ]}
              onClick={() => onViewChange(item.view as 'notes' | 'archive' | 'trash')}
            >
              <ListItemIcon
                sx={[
                  {
                    minWidth: 0,
                    justifyContent: 'center',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                  },
                  open
                    ? {
                        mr: 3,
                      }
                    : {
                        mr: 'auto',
                      },
                ]}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={[
                  open
                    ? {
                        opacity: 1,
                      }
                    : {
                        opacity: 0,
                      },
                ]}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}