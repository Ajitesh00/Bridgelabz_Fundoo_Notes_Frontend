'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
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
import TakeNotes, { NoteIconState } from './TakeNotes'; // Adjust path as needed

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
}

interface NoteColor {
  name: string;
  value: string;
  hex: string;
}

// Color palette for notes (same as TakeNotes)
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
  view: 'notes' | 'archive' | 'trash';
  onUpdateNote?: (id: string, updatedNote: Partial<Note>) => void;
  onDeleteNote?: (id: string) => void;
  onArchiveNote?: (id: string) => void;
  onTrashNote?: (id: string) => void;
  onPinNote?: (id: string) => void;
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
}

// Individual Note Card Component
const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onUpdate,
  onDelete,
  onArchive,
  onTrash,
  onPin,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);

  const currentColor = NOTE_COLORS.find(color => color.value === note.color) || NOTE_COLORS[0];

  const handleColorSelect = (color: NoteColor) => {
    onUpdate(note.id, { color: color.value }); // Update only color
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
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        minHeight: '120px',
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
      <Box sx={{ paddingRight: '32px' }}>
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
            }}
          >
            {note.content}
          </Typography>
        )}
      </Box>

      {/* Bottom toolbar - appears on hover */}
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
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Tooltip title="Remind me">
            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
              <NotificationsNone fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Collaborator">
            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
              <PersonAddAlt fontSize="small" />
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
    </Paper>
  );
};

// Main NotesContainer component
const NotesContainer: React.FC<NotesContainerProps> = ({
  notes,
  view,
  onUpdateNote,
  onDeleteNote,
  onArchiveNote,
  onTrashNote,
  onPinNote,
  className,
}) => {
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleEditNote = (note: Note) => {
    setEditingNote(note); // Open edit view without triggering delete
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
    setEditingNote(null); // Close edit view without delete
  };

  // Filter notes based on view, using intent-based validation
  const filteredNotes = notes.filter(note => {
    const isEmpty = !note.title.trim() && !note.content.trim();
    if (view === 'archive') return note.isArchived && !note.isTrash && !isEmpty;
    if (view === 'trash') return note.isTrash && !isEmpty;
    return !note.isArchived && !note.isTrash && !isEmpty; // Ensure only non-empty notes display
  });

  // Separate pinned and regular notes
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
      {/* Edit note overlay */}
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

      {/* Pinned notes section */}
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
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Regular notes section */}
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
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Empty state */}
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
            {view === 'archive' ? 'No archived notes' : view === 'trash' ? 'No trashed notes' : 'No notes yet'}
          </Typography>
          <Typography variant="body2">
            {view === 'archive' ? 'Archive some notes to see them here' : view === 'trash' ? 'Move some notes to trash to see them here' : 'Add a note to get started'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NotesContainer;