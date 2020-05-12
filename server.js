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
  if (fs.existsSync(outputPath)) {
    const notesArray = fs.readFileSync(outputPath, "utf8");
    notes = JSON.parse(notesArray);
  }
  else {
    notes = [];
  };

  return res.json(notes);
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
  notes.push(newNote);
  fs.writeFileSync(outputPath, JSON.stringify(notes, null, 2));
  res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res) {
  // Must use '==', not '===', because one is numeric and one is string
  const noteIndex = notes.findIndex(note => {return (note.id == req.params.id)});

  // The ID should always be found, but check, just in case
  if (noteIndex != -1) {
    notes.splice(noteIndex, 1);
    fs.writeFileSync(outputPath, JSON.stringify(notes, null, 2));
    return true
  }
  else {
    return false
  };
});

app.listen(PORT, console.log("Server starting on PORT ", PORT));