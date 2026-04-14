/**
 * REST handlers for notes backed by the in-memory noteStore.
 */

const express = require("express");
const noteStore = require("../models/noteStore");
const {
  validateCreateBody,
  validateUpdateBody,
  requireNoteExists,
} = require("../middleware/notesValidation");

const router = express.Router();

function controllerCreate(req, res) {
  const note = noteStore.create({ content: req.body.content });
  return res.status(201).json(note);
}

function controllerRead(_req, res) {
  res.json(noteStore.getAll());
}

function controllerUpdate(req, res) {
  const { id } = req.params;
  const note = noteStore.update(id, req.body);
  return res.json(note);
}

function controllerDelete(req, res) {
  const { id } = req.params;
  noteStore.remove(id);
  return res.status(204).send();
}

router.post("/notes", validateCreateBody, controllerCreate);
router.get("/notes", controllerRead);
router.put(
  "/notes/:id",
  requireNoteExists,
  validateUpdateBody,
  controllerUpdate,
);
router.delete("/notes/:id", requireNoteExists, controllerDelete);

module.exports = router;
