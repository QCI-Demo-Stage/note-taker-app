'use strict';

const express = require('express');
const noteStore = require('../models/noteStore');
const {
  validateCreateBody,
  validateUpdateBody,
  validateNoteExists,
} = require('../middleware/notesValidation');

const router = express.Router();

function controllerCreate(req, res) {
  const note = noteStore.create({ content: req.body.content.trim() });
  return res.status(201).json(note);
}

function controllerRead(_req, res) {
  return res.status(200).json(noteStore.getAll());
}

function controllerUpdate(req, res) {
  const updated = noteStore.update(req.params.id, {
    content: req.body.content.trim(),
  });
  if (!updated) {
    return res.status(404).json({ error: 'Note not found' });
  }
  return res.status(200).json(updated);
}

function controllerDelete(req, res) {
  const removed = noteStore.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Note not found' });
  }
  return res.status(204).send();
}

router.post('/', validateCreateBody, controllerCreate);
router.get('/', controllerRead);
router.put(
  '/:id',
  validateUpdateBody,
  validateNoteExists,
  controllerUpdate,
);
router.delete('/:id', validateNoteExists, controllerDelete);

module.exports = router;
