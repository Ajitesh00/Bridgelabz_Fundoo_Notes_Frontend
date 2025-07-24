'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Popper,
  ClickAwayListener,
  TextField,
  Button
} from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatColorText,
  Image,
  Palette,
  NotificationsNone,
  PersonAddAlt,
  Archive,
  Delete,
  MoreVert,
  Undo,
  Redo,
  Close,
  PushPin,
  PushPinOutlined,
  LabelOutlined
} from '@mui/icons-material';
import { addLabel, removeLabels } from '../services/note.service';

// Types
interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
  isArchived?: boolean;
  isTrash?: boolean;
  hasReminder?: boolean;
  reminderDateTime?: Date | null;
  labels: string[];
}

interface NoteColor {
  name: string;
  value: string;
  hex: string;
}

interface NoteIconState {
  formatBold?: boolean;
  formatItalic?: boolean;
  formatUnderlined?: boolean;
  hasImage?: boolean;
  hasReminder?: boolean;
  hasCollaborator?: boolean;
  isArchived?: boolean;
  isTrash?: boolean;
}

interface NoteIconsProps {
  noteColor: string;
  iconState: NoteIconState;
  onToggleIcon?: (iconName: keyof NoteIconState) => void;
  onColorChange: (color: NoteColor) => void;
  onPin?: (id: string) => void;
  onArchive?: (id: string) => void;
  onTrash?: (id: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, updatedNote: Partial<Note>) => void;
  isPinned?: boolean;
  onClose?: () => void;
  isHovered?: boolean;
  id?: string;
}

const NOTE_COLORS: NoteColor[] = [
  { name: 'Default', value: 'default', hex: '#ffffff' },
  { name: 'Red', value: 'red', hex: '#f28b82' },
  { name: 'Orange', value: 'orange', hex: '#fbbc04' },
  { name: 'Yellow', value: 'yellow', hex: '#fff475' },
  { name: 'Green', value: 'green', hex: '#ccff90' },
  { name: 'Teal', value: 'teal', hex: '#a7ffeb' },
  { name: 'Blue', value: 'blue', hex: '#cbf0f8' },
  { name: 'Dark Blue', value: 'dark-blue', hex: '#aecbfa' },
  { name: 'Purple', value: 'purple', hex: '#d7aefb' },
  { name: 'Pink', value: 'pink', hex: '#fdcfe8' },
  { name: 'Brown', value: 'brown', hex: '#e6c9a8' },
  { name: 'Gray', value: 'gray', hex: '#e8eaed' },
];

const NoteIcons: React.FC<NoteIconsProps> = ({
  noteColor,
  iconState,
  onToggleIcon,
  onColorChange,
  onPin,
  onArchive,
  onTrash,
  onDelete,
  onUpdate,
  isPinned,
  onClose,
  isHovered = true,
  id,
}) => {
  const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [labelAnchorEl, setLabelAnchorEl] = useState<null | HTMLElement>(null);
  const [labelInput, setLabelInput] = useState('');
  const [labelError, setLabelError] = useState<string | null>(null);
  const labelIconRef = useRef<HTMLButtonElement>(null);

  const currentColor = NOTE_COLORS.find(color => color.value === noteColor) || NOTE_COLORS[0];

  const handleIconClick = (iconName: keyof NoteIconState) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleIcon?.(iconName);
  };

  const handleAddLabel = async () => {
    if (!id) return;
    if (!labelInput.trim()) {
      setLabelError('Label name cannot be empty');
      return;
    }
    try {
      const labels = labelInput.split(',').map(label => label.trim()).filter(label => label);
      let updatedNote: Note | null = null;
      for (const label of labels) {
        updatedNote = await addLabel(id, label);
      }
      if (updatedNote && onUpdate) {
        onUpdate(id, { labels: updatedNote.labels });
      }
      setLabelInput('');
      setLabelAnchorEl(null);
      setLabelError(null);
    } catch (error) {
      setLabelError('Failed to add label');
    }
  };

  const handleRemoveLabels = async () => {
    if (!id) return;
    try {
      const updatedNote = await removeLabels(id);
      if (onUpdate) {
        onUpdate(id, { labels: updatedNote.labels });
      }
      setMoreMenuAnchor(null);
    } catch (error) {
      setLabelError('Failed to remove labels');
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          bottom: '4px',
          left: '4px',
          right: '4px',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          width: 'calc(100% - 8px)',
        }}
      >
        {/* Left side - Common icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Tooltip title="Bold">
            <IconButton
              size="small"
              onClick={handleIconClick('formatBold')}
              sx={{ color: iconState.formatBold ? '#1976d2' : 'rgba(0, 0, 0, 0.54)' }}
            >
              <FormatBold fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Italic">
            <IconButton
              size="small"
              onClick={handleIconClick('formatItalic')}
              sx={{ color: iconState.formatItalic ? '#1976d2' : 'rgba(0, 0, 0, 0.54)' }}
            >
              <FormatItalic fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Underline">
            <IconButton
              size="small"
              onClick={handleIconClick('formatUnderlined')}
              sx={{ color: iconState.formatUnderlined ? '#1976d2' : 'rgba(0, 0, 0, 0.54)' }}
            >
              <FormatUnderlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Text color">
            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
              <FormatColorText fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add image">
            <IconButton
              size="small"
              onClick={handleIconClick('hasImage')}
              sx={{ color: iconState.hasImage ? '#1976d2' : 'rgba(0, 0, 0, 0.54)' }}
            >
              <Image fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Background options">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setColorMenuAnchor(e.currentTarget);
              }}
            >
              <Palette fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add reminder">
            <IconButton
              size="small"
              onClick={handleIconClick('hasReminder')}
              sx={{ color: iconState.hasReminder ? '#1976d2' : 'rgba(0, 0, 0, 0.54)' }}
            >
              <NotificationsNone fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Collaborator">
            <IconButton
              size="small"
              onClick={handleIconClick('hasCollaborator')}
              sx={{ color: iconState.hasCollaborator ? '#1976d2' : 'rgba(0, 0, 0, 0.54)' }}
            >
              <PersonAddAlt fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="More">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setMoreMenuAnchor(e.currentTarget);
              }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Undo">
            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
              <Undo fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
              <Redo fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Right side - Optional Pin and Close buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          {onPin && id && (
            <Tooltip title={isPinned ? 'Unpin note' : 'Pin note'}>
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); onPin(id); }}>
                {isPinned ? <PushPin fontSize="small" /> : <PushPinOutlined fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
          {onClose && (
            <Tooltip title="Close">
              <IconButton size="small" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Color selection menu */}
      <Menu
        anchorEl={colorMenuAnchor}
        open={Boolean(colorMenuAnchor)}
        onClose={() => setColorMenuAnchor(null)}
        PaperProps={{
          sx: {
            padding: '8px',
            minWidth: '280px',
          },
        }}
      >
        <Box sx={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {NOTE_COLORS.map((color: NoteColor) => (
            <Box
              key={color.value}
              onClick={() => {
                onColorChange(color);
                setColorMenuAnchor(null);
              }}
              sx={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                backgroundColor: color.hex,
                border: noteColor === color.value ? '2px solid #1976d2' : '2px solid #e0e0e0',
                '&:hover': {
                  borderColor: '#1976d2',
                },
                transition: 'border-color 0.2s ease',
              }}
            />
          ))}
        </Box>
      </Menu>

      {/* More options menu */}
      <Menu
        anchorEl={moreMenuAnchor}
        open={Boolean(moreMenuAnchor)}
        onClose={() => setMoreMenuAnchor(null)}
      >
        {id ? [
          // <MenuItem
          //   key="add-label"
          //   onClick={(e) => {
          //     e.stopPropagation();
          //     setMoreMenuAnchor(null);
          //     setLabelAnchorEl(labelIconRef.current);
          //   }}
          // >
          //   <LabelOutlined fontSize="small" sx={{ mr: 1 }} />
          //   Add Label
          // </MenuItem>,
          // <MenuItem key="remove-labels" onClick={handleRemoveLabels}>
          //   <LabelOutlined fontSize="small" sx={{ mr: 1 }} />
          //   Remove Labels
          // </MenuItem>,
          <MenuItem key="archive" onClick={() => { onArchive?.(id); setMoreMenuAnchor(null); }}>
            <Archive fontSize="small" sx={{ mr: 1 }} />
            {iconState.isArchived ? 'Unarchive' : 'Archive'}
          </MenuItem>,
          <MenuItem key="trash" onClick={() => { onTrash?.(id); setMoreMenuAnchor(null); }}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            {iconState.isTrash ? 'Restore' : 'Move to Trash'}
          </MenuItem>,
          <MenuItem key="delete" onClick={() => { onDelete?.(id); setMoreMenuAnchor(null); }}>
            <Delete fontSize="small" sx={{ mr: 1 }} />
            Delete Permanently
          </MenuItem>
        ] : null}
      </Menu>

      {/* Label input Popper */}
      <Popper
        open={Boolean(labelAnchorEl)}
        anchorEl={labelAnchorEl}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={() => setLabelAnchorEl(null)}>
          <Box
            sx={{
              bgcolor: 'white',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '16px',
              p: 2,
              minWidth: '320px',
              maxWidth: '340px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <TextField
              label="Add Labels (comma-separated)"
              value={labelInput}
              onChange={(e) => {
                setLabelInput(e.target.value);
                setLabelError(null);
              }}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: '8px' } }}
              sx={{ mb: 2, width: '100%' }}
              error={!!labelError}
              helperText={labelError}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 1 }}>
              <Button
                onClick={() => setLabelAnchorEl(null)}
                variant="text"
                sx={{ textTransform: 'none', fontWeight: 500, color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddLabel}
                variant="contained"
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default NoteIcons;