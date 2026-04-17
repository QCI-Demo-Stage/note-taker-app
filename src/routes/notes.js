const express = require('express');
const noteStore = require('../models/noteStore');
const {
  validateCreateBody,
  validateUpdateBody,
  validateNoteExists,
} = require('../middleware/noteValidation');

const router = express.Router();

async function controllerCreate(req, res) {
  const created = await noteStore.create({ content: req.body.content });
  res.status(201).json(created);
}

async function controllerRead(_req, res) {
  res.json(await noteStore.getAll());
}

async function controllerUpdate(req, res) {
  const updated = await noteStore.update(req.params.id, {
    content: req.body.content,
  });
  if (!updated) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.json(updated);
}

async function controllerDelete(req, res) {
  const removed = await noteStore.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Note not found' });
  }
  res.status(204).send();
}

router.post('/notes', validateCreateBody, controllerCreate);
router.get('/notes', controllerRead);
router.put(
  '/notes/:id',
  validateNoteExists,
  validateUpdateBody,
  controllerUpdate,
);
router.delete('/notes/:id', validateNoteExists, controllerDelete);

module.exports = router;
