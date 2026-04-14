/**
 * REST handlers for notes backed by the in-memory noteStore.
 */

const express = require("express");
const noteStore = require("../models/noteStore");

const router = express.Router();

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function controllerCreate(req, res) {
  if (!isPlainObject(req.body)) {
    return res
      .status(400)
      .json({ error: "Request body must be a JSON object" });
  }
  if (typeof req.body.content !== "string") {
    return res.status(400).json({ error: 'Field "content" must be a string' });
  }
  const note = noteStore.create({ content: req.body.content });
  return res.status(201).json(note);
}

function controllerRead(_req, res) {
  res.json(noteStore.getAll());
}

function controllerUpdate(req, res) {
  const { id } = req.params;
  if (!isPlainObject(req.body)) {
    return res
      .status(400)
      .json({ error: "Request body must be a JSON object" });
  }
  if (
    req.body.content !== undefined &&
    typeof req.body.content !== "string"
  ) {
    return res.status(400).json({ error: 'Field "content" must be a string' });
  }
  const note = noteStore.update(id, req.body);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  return res.json(note);
}

function controllerDelete(req, res) {
  const { id } = req.params;
  const removed = noteStore.remove(id);
  if (!removed) {
    return res.status(404).json({ error: "Note not found" });
  }
  return res.status(204).send();
}

router.post("/notes", controllerCreate);
router.get("/notes", controllerRead);
router.put("/notes/:id", controllerUpdate);
router.delete("/notes/:id", controllerDelete);

module.exports = router;
