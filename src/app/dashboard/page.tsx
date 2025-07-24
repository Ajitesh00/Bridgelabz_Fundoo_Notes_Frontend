"use client";
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import PrimarySearchAppBar from '../components/header';
import MiniDrawer from '../components/sidenav';
import TakeNotes from '../components/TakeNotes';
import NotesContainer from '../components/NotesContainer';
import { getAllNotes, createNote, updateNote, deleteNote, archiveNote, trashNote, pinNote, setReminder } from '../services/note.service';

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

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  [theme.breakpoints.up('sm')]: {
    marginLeft: 0,
  },
  ...(open && {
    marginLeft: drawerWidth,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  paddingTop: theme.spacing(10),
}));

export default function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [currentView, setCurrentView] = React.useState<'notes' | 'reminders' | 'archive' | 'trash'>('notes');
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  React.useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getAllNotes();
        setNotes(fetchedNotes);
      } catch (error) {
        setError('Failed to fetch notes');
      }
    };
    fetchNotes();
  }, []);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleViewChange = (view: 'notes' | 'reminders' | 'archive' | 'trash') => {
    setCurrentView(view);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = searchQuery
      ? note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.labels.some(label => label.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const isEmpty = !note.title.trim() && !note.content.trim();
    if (currentView === 'archive') return note.isArchived && !note.isTrash && !isEmpty && matchesSearch;
    if (currentView === 'trash') return note.isTrash && !isEmpty && matchesSearch;
    if (currentView === 'reminders') return note.hasReminder && !note.isTrash && !isEmpty && matchesSearch;
    return !note.isTrash && !isEmpty && matchesSearch;
  });

  const handleSaveNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!noteData.title.trim() && !noteData.content.trim()) {
      setError('Title or content cannot be empty');
      return;
    }
    try {
      const newNote = await createNote({
        title: noteData.title,
        content: noteData.content,
        color: noteData.color,
        hasReminder: noteData.hasReminder || false,
        reminderDateTime: noteData.hasReminder ? noteData.reminderDateTime || null : null,
        labels: noteData.labels || []
      });
      setNotes(prev => [...prev, newNote]);
    } catch (error) {
      setError('Failed to save note');
    }
  };

  const handleUpdateNote = async (id: string, updatedNote: Partial<Note>) => {
    try {
      const updated = await updateNote(id, {
        title: updatedNote.title,
        content: updatedNote.content,
        color: updatedNote.color,
        labels: updatedNote.labels
      });
      setNotes(prev =>
        prev.map(note =>
          note.id === id
            ? { ...note, ...updated, updatedAt: new Date(updated.updatedAt) }
            : note
        )
      );
    } catch (error) {
      setError('Failed to update note');
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      setError('Failed to delete note');
    }
  };

  const handleArchiveNote = async (id: string) => {
    try {
      const updatedNote = await archiveNote(id);
      setNotes(prev =>
        prev.map(note =>
          note.id === id
            ? { ...note, isArchived: updatedNote.isArchived, isTrash: updatedNote.isTrash, updatedAt: new Date() }
            : note
        )
      );
    } catch (error) {
      setError('Failed to archive/unarchive note');
    }
  };

  const handleTrashNote = async (id: string) => {
    try {
      const updatedNote = await trashNote(id);
      setNotes(prev =>
        prev.map(note =>
          note.id === id
            ? { ...note, isTrash: updatedNote.isTrash, isArchived: updatedNote.isArchived, updatedAt: new Date() }
            : note
        )
      );
    } catch (error) {
      setError('Failed to trash/restore note');
    }
  };

  const handlePinNote = async (id: string) => {
    try {
      const updatedNote = await pinNote(id);
      setNotes(prev =>
        prev.map(note =>
          note.id === id
            ? { ...note, isPinned: updatedNote.isPinned, updatedAt: new Date() }
            : note
        )
      );
    } catch (error) {
      setError('Failed to pin/unpin note');
    }
  };

  const handleSetReminder = async (id: string, hasReminder: boolean, reminderDateTime: Date | null) => {
    try {
      const updatedNote = await setReminder(id, hasReminder, reminderDateTime);
      setNotes(prev =>
        prev.map(note =>
          note.id === id
            ? { ...note, hasReminder: updatedNote.hasReminder, reminderDateTime: updatedNote.reminderDateTime, updatedAt: new Date() }
            : note
        )
      );
    } catch (error) {
      setError('Failed to set/unset reminder');
    }
  };

  const handleNoteClose = () => {
    // No action needed, just close the note editor
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <PrimarySearchAppBar
        open={open}
        onDrawerToggle={handleDrawerToggle}
        onSearch={handleSearch}
      />
      <MiniDrawer
        open={open}
        onDrawerToggle={handleDrawerToggle}
        onViewChange={handleViewChange}
        currentView={currentView}
      />
      <Main open={open}>
        <Container
          maxWidth="xl"
          sx={{
            py: 4,
            width: '100%',
            marginLeft: '-100px',
            marginBottom: '-40px',
            paddingLeft: open ? `${drawerWidth}px` : '80px',
          }}
        >
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: '600px',
                minWidth: '300px',
              }}
            >
              <TakeNotes
                onSaveNote={handleSaveNote}
                onClose={handleNoteClose}
                onArchive={handleArchiveNote}
                onTrash={handleTrashNote}
                onPin={handlePinNote}
                onUpdate={handleUpdateNote}
              />
            </Box>
          </Box>
        </Container>
        <Container
          maxWidth={false}
          sx={{
            py: 4,
            width: '100%',
            maxWidth: '1100px',
            minWidth: '1048px',
            marginLeft: '-50px',
            paddingLeft: open ? `${drawerWidth}px` : '80px',
            overflow: 'hidden',
          }}
        >
          <NotesContainer
            notes={filteredNotes}
            view={currentView}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onArchiveNote={handleArchiveNote}
            onTrashNote={handleTrashNote}
            onPinNote={handlePinNote}
            onSetReminder={handleSetReminder}
          />
        </Container>
      </Main>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}