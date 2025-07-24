'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  ClickAwayListener,
  Tooltip,
} from '@mui/material';
import {
  CheckBox,
  Brush,
  Image,
} from '@mui/icons-material';
import NoteIcons from './NoteIcons';

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

interface NoteState {
  isExpanded: boolean;
  title: string;
  content: string;
  color: string;
  labels: string;
}

export interface NoteIconState {
  formatBold: boolean;
  formatItalic: boolean;
  formatUnderlined: boolean;
  hasImage: boolean;
  hasCheckbox?: boolean;
  isArchived?: boolean;
  isTrash?: boolean;
  hasReminder: boolean;
  hasCollaborator: boolean;
}

interface TakeNotesProps {
  onSaveNote?: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onClose?: () => void;
  onPin?: (id: string) => void;
  onArchive?: (id: string) => void;
  onTrash?: (id: string) => void;
  onUpdate?: (id: string, updatedNote: Partial<Note>) => void; // Updated signature
  className?: string;
  initialNote?: Note;
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

export default function TakeNotes({ onSaveNote, onClose, onPin, onArchive, onTrash, onUpdate, className, initialNote }: TakeNotesProps) {
  const [noteState, setNoteState] = useState<NoteState>({
    isExpanded: !!initialNote,
    title: initialNote?.title || '',
    content: initialNote?.content || '',
    color: initialNote?.color || 'default',
    labels: initialNote?.labels?.join(', ') || ''
  });
  
  const [iconState, setIconState] = useState<NoteIconState>({
    formatBold: false,
    formatItalic: false,
    formatUnderlined: false,
    hasImage: false,
    hasCheckbox: false,
    isArchived: initialNote?.isArchived || false,
    isTrash: initialNote?.isTrash || false,
    hasReminder: initialNote?.hasReminder || false,
    hasCollaborator: false,
  });

  const contentRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialNote) {
      setNoteState({
        isExpanded: true,
        title: initialNote.title || '',
        content: initialNote.content || '',
        color: initialNote.color || 'default',
        labels: initialNote.labels?.join(', ') || ''
      });
      setIconState(prev => ({
        ...prev,
        isArchived: initialNote.isArchived || false,
        isTrash: initialNote.isTrash || false,
        hasReminder: initialNote.hasReminder || false,
      }));
    }
  }, [initialNote]);

  useEffect(() => {
    if (noteState.isExpanded && !initialNote && contentRef.current) {
      contentRef.current.focus();
    }
  }, [noteState.isExpanded, initialNote]);

  const currentColor = NOTE_COLORS.find(color => color.value === noteState.color) || NOTE_COLORS[0];

  const handleExpand = () => {
    setNoteState(prev => ({ ...prev, isExpanded: true }));
  };

  const handleClose = () => {
    if ((noteState.title?.trim() || noteState.content?.trim())) {
      onSaveNote?.({
        title: noteState.title || '',
        content: noteState.content || '',
        color: noteState.color,
        isArchived: iconState.isArchived,
        isTrash: iconState.isTrash,
        hasReminder: iconState.hasReminder,
        labels: noteState.labels ? noteState.labels.split(',').map(label => label.trim()).filter(label => label) : []
      });
    }
    
    if (!initialNote) {
      setNoteState({
        isExpanded: false,
        title: '',
        content: '',
        color: 'default',
        labels: ''
      });
      setIconState({
        formatBold: false,
        formatItalic: false,
        formatUnderlined: false,
        hasImage: false,
        hasCheckbox: false,
        isArchived: false,
        isTrash: false,
        hasReminder: false,
        hasCollaborator: false,
      });
    }
    
    onClose?.();
  };

  const handleColorSelect = (color: NoteColor) => {
    setNoteState(prev => ({ ...prev, color: color.value }));
  };

  const handleUpdate = (id: string, updatedNote: Partial<Note>) => {
    if (updatedNote.labels !== undefined) {
      setNoteState(prev => ({ ...prev, labels: updatedNote.labels?.join(', ') || '' }));
    }
    onUpdate?.(id, updatedNote);
  };

  const toggleIcon = (iconName: keyof NoteIconState) => {
    setIconState(prev => ({
      ...prev,
      [iconName]: !prev[iconName],
    }));
  };

  const handleClickAway = () => {
    if (noteState.isExpanded && (noteState.title?.trim() || noteState.content?.trim())) {
      handleClose();
    } else if (noteState.isExpanded && !initialNote) {
      setNoteState(prev => ({ ...prev, isExpanded: false, color: 'default', labels: '' }));
    } else if (noteState.isExpanded && initialNote) {
      onClose?.();
    }
  };

  const commonStyles = {
    backgroundColor: currentColor.hex,
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    margin: '8px 0',
    width: '100%',
    maxWidth: '600px',
    boxSizing: 'border-box',
    padding: '16px',
    position: 'relative',
  };

  if (!noteState.isExpanded && !initialNote) {
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper
          onClick={handleExpand}
          className={`hover:shadow-md transition-shadow ${className || ''}`}
          sx={{
            ...commonStyles,
            minHeight: '46px',
            cursor: 'text',
            paddingTop: '12px',
            paddingBottom: '12px',
          }}
        >
          <Box className="flex items-center justify-between w-full">
            <span className="text-gray-600 text-sm">
              {noteState.title || noteState.content || 'Take a note...'}
            </span>
            <Box className="flex items-center gap-1">
              <Tooltip title="New list">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleIcon('hasCheckbox'); }}>
                  <CheckBox fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="New note with drawing">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleIcon('hasImage'); }}>
                  <Brush fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="New note with image">
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleIcon('hasImage'); }}>
                  <Image fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>
      </ClickAwayListener>
    );
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Paper
        className={`transition-shadow ${className || ''}`}
        sx={{
          ...commonStyles,
          minHeight: '70px',
          paddingBottom: '40px',
        }}
      >
        <Box>
          <TextField
            placeholder="Title"
            value={noteState.title || ''}
            onChange={(e) => setNoteState(prev => ({ ...prev, title: e.target.value }))}
            variant="standard"
            fullWidth
            autoFocus={!!initialNote}
            sx={{
              mb: 0.5,
              '& .MuiInput-underline:before': { display: 'none' },
              '& .MuiInput-underline:hover:before': { display: 'none' },
              '& .MuiInput-underline:after': { display: 'none' },
              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' },
              '& .MuiInputBase-input': {
                fontSize: '16px',
                fontWeight: 500,
                padding: '4px 0',
                cursor: 'text',
              },
            }}
          />
          <TextField
            placeholder="Take a note..."
            value={noteState.content || ''}
            onChange={(e) => setNoteState(prev => ({ ...prev, content: e.target.value }))}
            variant="standard"
            fullWidth
            multiline
            minRows={1}
            inputRef={contentRef}
            sx={{
              mb: 1,
              '& .MuiInput-underline:before': { display: 'none' },
              '& .MuiInput-underline:hover:before': { display: 'none' },
              '& .MuiInput-underline:after': { display: 'none' },
              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' },
              '& .MuiInputBase-input': {
                fontSize: '14px',
                padding: '2px 0',
                cursor: 'text',
              },
            }}
          />
          <TextField
            placeholder="Labels (comma-separated)"
            value={noteState.labels || ''}
            onChange={(e) => setNoteState(prev => ({ ...prev, labels: e.target.value }))}
            variant="standard"
            fullWidth
            sx={{
              mb: 1,
              '& .MuiInput-underline:before': { display: 'none' },
              '& .MuiInput-underline:hover:before': { display: 'none' },
              '& .MuiInput-underline:after': { display: 'none' },
              '& .MuiInput-underline:hover:not(.Mui-disabled):before': { display: 'none' },
              '& .MuiInputBase-input': {
                fontSize: '14px',
                padding: '2px 0',
                cursor: 'text',
              },
            }}
          />
        </Box>
        <NoteIcons
          noteColor={noteState.color}
          iconState={iconState}
          onToggleIcon={toggleIcon}
          onColorChange={handleColorSelect}
          onPin={initialNote ? () => onPin?.(initialNote.id) : undefined}
          onArchive={initialNote ? () => onArchive?.(initialNote.id) : undefined}
          onTrash={initialNote ? () => onTrash?.(initialNote.id) : undefined}
          // onUpdate={initialNote ? handleUpdate : undefined}
          onClose={handleClose}
          id={initialNote?.id}
        />
      </Paper>
    </ClickAwayListener>
  );
}