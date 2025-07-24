'use client';

import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Popper,
  ClickAwayListener,
  TextField,
  Button,
  Chip,
  Stack,
  Avatar
} from '@mui/material';
import {
  Archive,
  Delete,
  Palette,
  PersonAddAlt,
  NotificationsNone,
  Image,
  MoreVert,
  PushPin,
  PushPinOutlined,
} from '@mui/icons-material';
import { deepOrange } from '@mui/material/colors';
import TakeNotes, { NoteIconState } from './TakeNotes';
import { setReminder, addLabel, removeLabels, setCollaborator } from '../services/note.service';
import { format } from 'date-fns';
import './NotesContainer.css';

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
  hasCollaborator?: boolean; // Added
  collaboratorEmail?: string | null; // Added
}

interface NoteColor {
  name: string;
  value: string;
  hex: string;
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

interface NotesContainerProps {
  notes: Note[];
  view: 'notes' | 'reminders' | 'archive' | 'trash';
  onUpdateNote?: (id: string, updatedNote: Partial<Note>) => void;
  onDeleteNote?: (id: string) => void;
  onArchiveNote?: (id: string) => void;
  onTrashNote?: (id: string) => void;
  onPinNote?: (id: string) => void;
  onSetReminder?: (id: string, hasReminder: boolean, reminderDateTime: Date | null) => void;
  className?: string;
}

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onUpdate: (id: string, updatedNote: Partial<Note>) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onTrash: (id: string) => void;
  onPin: (id: string) => void;
  onSetReminder: (id: string, hasReminder: boolean, reminderDateTime: Date | null) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onUpdate,
  onDelete,
  onArchive,
  onTrash,
  onPin,
  onSetReminder,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);
  const [reminderAnchorEl, setReminderAnchorEl] = useState<null | HTMLElement>(null);
  const [collaboratorAnchorEl, setCollaboratorAnchorEl] = useState<null | HTMLElement>(null);
  const [reminderDateTime, setReminderDateTime] = useState<Date | null>(
    note.reminderDateTime || null
  );
  const [collaboratorEmail, setCollaboratorEmail] = useState<string | null>(
    note.collaboratorEmail || null
  );
  const reminderIconRef = useRef<HTMLButtonElement>(null);
  const collaboratorIconRef = useRef<HTMLButtonElement>(null);

  const currentColor = NOTE_COLORS.find(color => color.value === note.color) || NOTE_COLORS[0];

  const handleColorSelect = (color: NoteColor) => {
    onUpdate(note.id, { color: color.value });
    setColorMenuAnchor(null);
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPin(note.id);
  };

  const handleArchive = () => {
    onArchive(note.id);
    setMoreMenuAnchor(null);
  };

  const handleTrash = () => {
    onTrash(note.id);
    setMoreMenuAnchor(null);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
    setMoreMenuAnchor(null);
  };

  const handleReminderClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setReminderAnchorEl(reminderIconRef.current);
  };

  const handleCollaboratorClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setCollaboratorAnchorEl(collaboratorIconRef.current);
  };

  const handleReminderSave = async () => {
    try {
      await onSetReminder(note.id, !!reminderDateTime, reminderDateTime);
      setReminderAnchorEl(null);
    } catch (error) {
      console.error('Failed to set reminder:', error);
    }
  };

  const handleReminderCancel = () => {
    setReminderDateTime(note.reminderDateTime || null);
    setReminderAnchorEl(null);
  };

  const handleReminderDelete = async () => {
    setReminderDateTime(null);
    await onSetReminder(note.id, false, null);
    setReminderAnchorEl(null);
  };

  const handleCollaboratorSave = async () => {
    try {
      const updatedNote = await setCollaborator(note.id, !!collaboratorEmail, collaboratorEmail);
      onUpdate(note.id, {
        hasCollaborator: updatedNote.hasCollaborator,
        collaboratorEmail: updatedNote.collaboratorEmail
      });
      setCollaboratorAnchorEl(null);
    } catch (error) {
      console.error('Failed to set collaborator:', error);
    }
  };

  const handleCollaboratorRemove = async () => {
    setCollaboratorEmail(null);
    try {
      const updatedNote = await setCollaborator(note.id, false, null);
      onUpdate(note.id, {
        hasCollaborator: updatedNote.hasCollaborator,
        collaboratorEmail: updatedNote.collaboratorEmail
      });
      setCollaboratorAnchorEl(null);
    } catch (error) {
      console.error('Failed to remove collaborator:', error);
    }
  };

  const handleCollaboratorCancel = () => {
    setCollaboratorEmail(note.collaboratorEmail || null);
    setCollaboratorAnchorEl(null);
  };

  const handleLabelDelete = async (label: string) => {
    try {
      const updatedNote = await removeLabels(note.id, label);
      onUpdate(note.id, { labels: updatedNote.labels });
    } catch (error) {
      console.error('Failed to delete label:', error);
    }
  };

  const formatReminderDate = (date: Date | null) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  // Get the first letter of the collaborator email for the Avatar
  const getCollaboratorInitial = (email: string | null) => {
    return email ? email.charAt(0).toUpperCase() : '';
  };

  return (
    <Paper
      onClick={() => onEdit(note)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        backgroundColor: currentColor.hex,
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '12px',
        paddingBottom: '20px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        maxWidth: '250px',
        width: '100%',
        '&:hover': {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Pin button - top right */}
      <Box
        sx={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          opacity: isHovered || note.isPinned ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <Tooltip title={note.isPinned ? 'Unpin note' : 'Pin note'}>
          <IconButton size="small" onClick={handlePin}>
            {note.isPinned ? (
              <PushPin fontSize="small" />
            ) : (
              <PushPinOutlined fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Note content */}
      <Box sx={{ paddingRight: '32px', paddingBottom: '8px' }}>
        {note.title && (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 500,
              marginBottom: '8px',
              wordBreak: 'break-word',
              fontSize: '16px',
              lineHeight: '20px',
            }}
          >
            {note.title}
          </Typography>
        )}
        {note.content && (
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(0, 0, 0, 0.87)',
              wordBreak: 'break-word',
              fontSize: '14px',
              lineHeight: '20px',
              whiteSpace: 'pre-wrap',
              marginBottom: note.hasReminder || note.labels.length > 0 || note.hasCollaborator ? '18px' : '30px',
            }}
          >
            {note.content}
          </Typography>
        )}
      </Box>

      {/* Reminder, Label, and Collaborator Chips/Avatar */}
      {(note.hasReminder || note.labels.length > 0 || note.hasCollaborator) && (
        <Stack direction="row" spacing={1} sx={{ mb: 3.5, flexWrap: 'wrap', gap: 1 }}>
          {note.hasReminder && note.reminderDateTime && (
            <Chip
              label={formatReminderDate(note.reminderDateTime)}
              size="small"
              sx={{ fontSize: '12px' }}
              onDelete={handleReminderDelete}
            />
          )}
          {note.labels.map((label) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{ fontSize: '12px' }}
              onDelete={() => handleLabelDelete(label)}
            />
          ))}
          {note.hasCollaborator && note.collaboratorEmail && (
            <Avatar
              sx={{
                bgcolor: deepOrange[500],
                width: 24,
                height: 24,
                fontSize: '12px'
              }}
            >
              {getCollaboratorInitial(note.collaboratorEmail)}
            </Avatar>
          )}
        </Stack>
      )}

      {/* Bottom toolbar - appears on hover, positioned below content and chip with increased gap */}
      <Box
        sx={{
          position: 'absolute',
          bottom: '4px',
          left: '4px',
          right: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          paddingTop: '16px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Tooltip title="Remind me">
            <IconButton
              size="small"
              onClick={handleReminderClick}
              ref={reminderIconRef}
            >
              <NotificationsNone
                fontSize="small"
                color={note.hasReminder ? 'primary' : 'inherit'}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title="Collaborator">
            <IconButton
              size="small"
              onClick={handleCollaboratorClick}
              ref={collaboratorIconRef}
            >
              <PersonAddAlt
                fontSize="small"
                color={note.hasCollaborator ? 'primary' : 'inherit'}
              />
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
          <Tooltip title="Add image">
            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
              <Image fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={note.isArchived ? 'Unarchive' : 'Archive'}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleArchive(); }}>
              <Archive fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={note.isTrash ? 'Restore' : 'Move to Trash'}>
            <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleTrash(); }}>
              <Delete fontSize="small" />
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
          {NOTE_COLORS.map((color) => (
            <Box
              key={color.value}
              onClick={() => handleColorSelect(color)}
              sx={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                backgroundColor: color.hex,
                border: note.color === color.value ? '2px solid #1976d2' : '2px solid #e0e0e0',
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
        <MenuItem onClick={handleDelete}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Permanently
        </MenuItem>
      </Menu>

      {/* Reminder Popper */}
      <Popper
        open={Boolean(reminderAnchorEl)}
        anchorEl={reminderAnchorEl}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleReminderCancel}>
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
              label="Reminder"
              type="datetime-local"
              value={reminderDateTime ? format(reminderDateTime, "yyyy-MM-dd'T'HH:mm") : ''}
              onChange={(e) => setReminderDateTime(e.target.value ? new Date(e.target.value) : null)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: '8px' } }}
              sx={{ mb: 2, width: '100%' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 1 }}>
              <Button
                onClick={handleReminderCancel}
                variant="text"
                sx={{ textTransform: 'none', fontWeight: 500, color: 'text.secondary' }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReminderSave}
                variant="contained"
                disabled={!reminderDateTime}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>

      {/* Collaborator Popper */}
      <Popper
        open={Boolean(collaboratorAnchorEl)}
        anchorEl={collaboratorAnchorEl}
        placement="bottom-start"
        sx={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleCollaboratorCancel}>
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
              label="Collaborator Email"
              type="email"
              value={collaboratorEmail || ''}
              onChange={(e) => setCollaboratorEmail(e.target.value || null)}
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: '8px' } }}
              sx={{ mb: 2, width: '100%' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', gap: 1 }}>
              <Button
                onClick={handleCollaboratorRemove}
                variant="text"
                sx={{ textTransform: 'none', fontWeight: 500, color: 'text.secondary' }}
              >
                Remove
              </Button>
              <Button
                onClick={handleCollaboratorSave}
                variant="contained"
                disabled={!collaboratorEmail}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </ClickAwayListener>
      </Popper>
    </Paper>
  );
};

const NotesContainer: React.FC<NotesContainerProps> = ({
  notes,
  view,
  onUpdateNote,
  onDeleteNote,
  onArchiveNote,
  onTrashNote,
  onPinNote,
  onSetReminder,
  className,
}) => {
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleSaveEditedNote = (updatedNote: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingNote && onUpdateNote) {
      onUpdateNote(editingNote.id, {
        ...updatedNote,
        updatedAt: new Date(),
      });
    }
    setEditingNote(null);
  };

  const handleCloseEdit = () => {
    setEditingNote(null);
  };

  const filteredNotes = notes.filter(note => {
    const isEmpty = !note.title.trim() && !note.content.trim();
    if (view === 'archive') return note.isArchived && !note.isTrash && !isEmpty;
    if (view === 'trash') return note.isTrash && !isEmpty;
    if (view === 'reminders') return note.hasReminder && !note.isTrash && !isEmpty;
    return !note.isTrash && !note.isArchived && !isEmpty;
  });

  const pinnedNotes = filteredNotes.filter(note => note.isPinned);
  const regularNotes = filteredNotes.filter(note => !note.isPinned);

  return (
    <Box
      className={className}
      sx={{
        marginLeft: 0,
        paddingLeft: '16px',
        width: '100%',
        maxWidth: '1600px',
        position: 'relative',
      }}
    >
      {editingNote && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            marginLeft: '82px',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '600px',
              margin: '0 auto',
              padding: '16px',
            }}
          >
            <TakeNotes
              onSaveNote={handleSaveEditedNote}
              onClose={handleCloseEdit}
              onArchive={() => onArchiveNote?.(editingNote.id)}
              onTrash={() => onTrashNote?.(editingNote.id)}
              initialNote={editingNote}
            />
          </Box>
        </Box>
      )}

      {pinnedNotes.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(0, 0, 0, 0.54)',
              fontWeight: 500,
              mb: 2,
              textTransform: 'uppercase',
              fontSize: '11px',
              letterSpacing: '0.8px',
            }}
          >
            Pinned
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
              mb: 3,
            }}
          >
            {pinnedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onUpdate={onUpdateNote || (() => {})}
                onDelete={onDeleteNote || (() => {})}
                onArchive={onArchiveNote || (() => {})}
                onTrash={onTrashNote || (() => {})}
                onPin={onPinNote || (() => {})}
                onSetReminder={onSetReminder || (() => {})}
              />
            ))}
          </Box>
        </Box>
      )}

      {regularNotes.length > 0 && (
        <Box>
          {pinnedNotes.length > 0 && (
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(0, 0, 0, 0.54)',
                fontWeight: 500,
                mb: 2,
                textTransform: 'uppercase',
                fontSize: '11px',
                letterSpacing: '0.8px',
              }}
            >
              Others
            </Typography>
          )}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {regularNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onUpdate={onUpdateNote || (() => {})}
                onDelete={onDeleteNote || (() => {})}
                onArchive={onArchiveNote || (() => {})}
                onTrash={onTrashNote || (() => {})}
                onPin={onPinNote || (() => {})}
                onSetReminder={onSetReminder || (() => {})}
              />
            ))}
          </Box>
        </Box>
      )}

      {filteredNotes.length === 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '200px',
            color: 'rgba(0, 0, 0, 0.54)',
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            {view === 'archive' ? 'No archived notes' : view === 'trash' ? 'No trashed notes' : view === 'reminders' ? 'No reminders set' : 'No notes yet'}
          </Typography>
          <Typography variant="body2">
            {view === 'archive' ? 'Archive some notes to see them here' : view === 'trash' ? 'Move some notes to trash to see them here' : view === 'reminders' ? 'Set reminders for notes to see them here' : 'Add a note to get started'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NotesContainer;