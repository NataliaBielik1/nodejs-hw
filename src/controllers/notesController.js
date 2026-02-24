import createHttpError from 'http-errors';
import {
    getNoteById as getNoteByIdService,
    createNote as createNoteService,
    deleteNote as deleteNoteService,
    updateNote as updateNoteService,
    getAllNotes as getAllNotesService,
} from '../services/notesService.js';

export const getNoteById = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await getNoteByIdService(noteId);

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

export const createNote = async (req, res, next) => {
    try {
        const note = await createNoteService(req.body);

        res.status(201).json(note);
    } catch (error) {
        next(error);
    }
};

export const deleteNote = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await deleteNoteService(noteId);

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

export const updateNote = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await updateNoteService(noteId, req.body);

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

export const getAllNotes = async (req, res, next) => {
    try {
        const notes = await getAllNotesService();

        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
};
