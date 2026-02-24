import { Note } from '../models/note.js';

export const getNoteById = async (noteId) => {
    const note = await Note.findById(noteId);
    return note;
};

export const createNote = async (payload) => {
    const note = await Note.create(payload);
    return note;
};

export const deleteNote = async (noteId) => {
    const note = await Note.findByIdAndDelete(noteId);
    return note;
};

export const updateNote = async (noteId, payload, options = {}) => {
    const note = await Note.findByIdAndUpdate(noteId, payload, {
        new: true,
        ...options,
    });
    return note;
};

export const getAllNotes = async () => {
    const notes = await Note.find();
    return notes;
};
