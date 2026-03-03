import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export const getNoteById = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await Note.findById(noteId);

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
        const note = await Note.create(req.body);

        res.status(201).json(note);
    } catch (error) {
        next(error);
    }
};

export const deleteNote = async (req, res, next) => {
    const { noteId } = req.params;

    try {
        const note = await Note.findByIdAndDelete(noteId);

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
        const note = await Note.findByIdAndUpdate(noteId, req.body, {
            new: true,
        });

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

export const getAllNotes = async (req, res, next) => {
    const { tag, search, page = 1, perPage = 10 } = req.query;

    try {
        const skip = (Number(page) - 1) * Number(perPage);
        const limit = Number(perPage);

        const notesQuery = Note.find();
        const countQuery = Note.countDocuments();

        if (tag) {
            notesQuery.where('tag').equals(tag);
            countQuery.where('tag').equals(tag);
        }

        if (search) {
            notesQuery.where({ $text: { $search: search } });
            countQuery.where({ $text: { $search: search } });
        }

        const [notes, totalNotes] = await Promise.all([
            notesQuery.skip(skip).limit(limit),
            countQuery,
        ]);

        const totalPages = Math.ceil(totalNotes / limit);

        res.status(200).json({
            page: Number(page),
            perPage: Number(perPage),
            totalNotes,
            totalPages,
            notes,
        });
    } catch (error) {
        next(error);
    }
};
