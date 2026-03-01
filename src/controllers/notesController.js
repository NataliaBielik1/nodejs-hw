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
        const filter = {};

        if (tag) {
            filter.tag = tag;
        }

        if (search) {
            filter.$text = { $search: search };
        }

        const skip = (Number(page) - 1) * Number(perPage);
        const limit = Number(perPage);

        const notes = await Note.find(filter).skip(skip).limit(limit);
        const totalNotes = await Note.countDocuments(filter);
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
