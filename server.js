const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3000;
const OUTPUT_DIR = path.resolve(__dirname, "db");
const outputPath = path.join(OUTPUT_DIR, "db.json");

let notes = [];

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  const notesArray = fs.readFileSync(outputPath, "utf8");
  notes = JSON.parse(notesArray);
  console.log(notesArray);
  return res.json(notes);
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/api/notes", function(req, res) {
  const newNote = req.body;
  // if note doesn't have an id yet (new note vs. updated note), assign id the current date/time
  if (!newNote.id) {
    newNote.id = Date.now();
  };
  console.log(newNote);
  notes.push(newNote);
  fs.writeFileSync(outputPath, JSON.stringify(notes, null, 2));
  res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res) {
  notes.splice(notes.findIndex(note => {return (note.id === req.params.id)}), 1);
  fs.writeFileSync(outputPath, JSON.stringify(notes));
  // TODO: what to return???
});

app.listen(PORT, console.log("Server starting on PORT ", PORT));