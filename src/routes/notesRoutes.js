import { Router } from 'express';
import * as notesController from '../controllers/notesController.js';

const router = Router();

router.get('/:noteId', notesController.getNoteById);

router.post('/', notesController.createNote);

router.delete('/:noteId', notesController.deleteNote);

router.patch('/:noteId', notesController.updateNote);

export default router;
