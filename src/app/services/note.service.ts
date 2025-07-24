import axios from 'axios';

// Generate a simple unique ID using timestamp and random number
const generateUniqueId = () => {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Define Note interface to match frontend expectations
interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isArchived: boolean;
  isTrash: boolean;
  hasReminder: boolean;
  reminderDateTime: Date | null;
  labels: string[]; // Added labels field
}

// Define input for creating/updating notes
interface NoteInput {
  title: string;
  content: string;
  color: string;
  hasReminder?: boolean;
  reminderDateTime?: Date | null;
  labels?: string[]; // Added labels field
}

// Base URL for API
const API_BASE_URL = 'http://localhost:4000/api/v1/notes';

// Helper function to map backend note to frontend Note interface
const mapToFrontendNote = (backendNote: any, originalInput?: NoteInput): Note => {
  if (!backendNote) {
    console.error('backendNote is undefined or null:', backendNote);
    return {
      id: generateUniqueId(),
      title: originalInput?.title || '',
      content: originalInput?.content || '',
      color: originalInput?.color || 'default',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isArchived: false,
      isTrash: false,
      hasReminder: false,
      reminderDateTime: null,
      labels: originalInput?.labels || [] // Default to empty array if no labels
    };
  }
  console.log('Mapping backendNote:', backendNote);
  return {
    id: backendNote.id ? backendNote.id.toString() : generateUniqueId(),
    title: backendNote.title || originalInput?.title || '',
    content: backendNote.description || originalInput?.content || '',
    color: backendNote.color || originalInput?.color || 'default',
    createdAt: new Date(backendNote.createdAt || Date.now()),
    updatedAt: new Date(backendNote.updatedAt || Date.now()),
    isPinned: backendNote.isPinned || false,
    isArchived: backendNote.isArchived || false,
    isTrash: backendNote.isTrash || false,
    hasReminder: backendNote.hasReminder || false,
    reminderDateTime: backendNote.reminderDateTime ? new Date(backendNote.reminderDateTime) : null,
    labels: backendNote.labels || [] // Normalize NULL to []
  };
};

// Get all notes for the authenticated user
export const getAllNotes = async (): Promise<Note[]> => {
  try {
    const response = await axios.get(API_BASE_URL, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('getAllNotes response:', JSON.stringify(response.data, null, 2));
    const notes = Array.isArray(response.data.data) ? response.data.data : [];
    return notes.map(mapToFrontendNote);
  } catch (error: any) {
    console.error('Failed to fetch notes:', error);
    console.error('Response:', error.response?.data);
    return [];
  }
};

// Get a note by ID
export const getNoteById = async (id: string): Promise<Note> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('getNoteById response:', JSON.stringify(response.data, null, 2));
    return mapToFrontendNote(response.data.data);
  } catch (error) {
    console.error(`Failed to fetch note ${id}:`, error);
    throw error;
  }
};

// Create a new note
export const createNote = async (note: NoteInput): Promise<Note> => {
  try {
    const response = await axios.post(API_BASE_URL, {
      title: note.title,
      description: note.content,
      color: note.color,
      hasReminder: note.hasReminder || false,
      reminderDateTime: note.hasReminder ? note.reminderDateTime || null : null,
      labels: note.labels || null // Include labels
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('createNote response:', JSON.stringify(response.data, null, 2));
    return mapToFrontendNote(response.data.data, note);
  } catch (error: any) {
    console.error('Failed to create note:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
};

// Update a note by ID
export const updateNote = async (id: string, note: Partial<NoteInput>): Promise<Note> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, {
      title: note.title,
      description: note.content,
      color: note.color,
      labels: note.labels !== undefined ? note.labels : undefined // Include labels if provided
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('updateNote response:', JSON.stringify(response.data, null, 2));
    return mapToFrontendNote(response.data.data);
  } catch (error) {
    console.error(`Failed to update note ${id}:`, error);
    throw error;
  }
};

// Delete a note by ID
export const deleteNote = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('deleteNote response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error(`Failed to delete note ${id}:`, error);
    throw error;
  }
};

// Archive or unarchive a note by ID
export const archiveNote = async (id: string): Promise<Note> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/archive`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('archiveNote response:', JSON.stringify(response.data, null, 2));
    return mapToFrontendNote(response.data.data);
  } catch (error) {
    console.error(`Failed to archive/unarchive note ${id}:`, error);
    throw error;
  }
};

// Trash or restore a note by ID
export const trashNote = async (id: string): Promise<Note> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/trash`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('trashNote response:', JSON.stringify(response.data, null, 2));
    return mapToFrontendNote(response.data.data);
  } catch (error) {
    console.error(`Failed to trash/restore note ${id}:`, error);
    throw error;
  }
};

// Pin or unpin a note by ID
export const pinNote = async (id: string): Promise<Note> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/pin`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('pinNote response:', JSON.stringify(response.data, null, 2));
    return mapToFrontendNote(response.data.data);
  } catch (error) {
    console.error(`Failed to pin/unpin note ${id}:`, error);
    throw error;
  }
};

// Set or unset a reminder for a note by ID
export const setReminder = async (id: string, hasReminder: boolean, reminderDateTime: Date | null): Promise<Note> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}/reminder`, {
      hasReminder,
      reminderDateTime
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('setReminder response:', JSON.stringify(response.data, null, 2));
    return mapToFrontendNote(response.data.data);
  } catch (error) {
    console.error(`Failed to set/unset reminder for note ${id}:`, error);
    throw error;
  }
};

// Add a label to a note by ID
export const addLabel = async (id: string, label: string): Promise<Note> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/${id}/labels`, { name: label }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    console.log('addLabel response:', JSON.stringify(response.data, null, 2));
    return mapToFrontendNote(response.data.data);
  } catch (error) {
    console.error(`Failed to add label to note ${id}:`, error);
    throw error;
  }
};

// Remove all labels from a note by ID
export const removeLabels = async (id: string, label?: string): Promise<Note> => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}/labels`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      data: label ? { name: label } : {}, // Send label if provided, else empty body to clear all
    });
    console.log('removeLabels response:', JSON.stringify(response.data, null, 2));
    return mapToFrontendNote(response.data.data);
  } catch (error) {
    console.error(`Failed to remove labels from note ${id}:`, error);
    throw error;
  }
};