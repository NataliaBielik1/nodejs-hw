import createHttpError from 'http-errors';
import * as notesService from '../services/notesService.js';

export const getNoteById = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await notesService.getNoteById(noteId);

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json({
            status: 200,
            message: `Successfully found note with id ${noteId}!`,
            data: note,
        });
    } catch (error) {
        next(error);
    }
};

export const createNote = async (req, res, next) => {
    try {
        const note = await notesService.createNote(req.body);

        res.status(201).json({
            status: 201,
            message: 'Successfully created a note!',
            data: note,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteNote = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await notesService.deleteNote(noteId);

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json({
            status: 200,
            message: `Successfully deleted note with id ${noteId}!`,
            data: note,
        });
    } catch (error) {
        next(error);
    }
};

export const updateNote = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await notesService.updateNote(noteId, req.body);

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json({
            status: 200,
            message: `Successfully updated note with id ${noteId}!`,
            data: note,
        });
    } catch (error) {
        next(error);
    }
};
