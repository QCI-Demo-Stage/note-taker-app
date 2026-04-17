'use strict';

const noteStore = require('../models/noteStore');

function hasValidContent(body) {
  return (
    body &&
    typeof body.content === 'string' &&
    body.content.trim().length > 0
  );
}

function validateCreateBody(req, res, next) {
  if (!hasValidContent(req.body)) {
    return res.status(400).json({ error: 'Missing content' });
  }
  return next();
}

function validateUpdateBody(req, res, next) {
  if (!hasValidContent(req.body)) {
    return res.status(400).json({ error: 'Missing content' });
  }
  return next();
}

function validateNoteExists(req, res, next) {
  const { id } = req.params;
  const note = noteStore.getAll().find((n) => n.id === id);
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  return next();
}

module.exports = {
  validateCreateBody,
  validateUpdateBody,
  validateNoteExists,
};
