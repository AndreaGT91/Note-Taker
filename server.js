const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 3000;
const OUTPUT_DIR = path.resolve(__dirname, "db");
const outputPath = path.join(OUTPUT_DIR, "db.json");

let notes = [];

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/notes", function(req, res) {
  notes = fs.readFileSync(outputPath, "utf8");
  return res.json(notes);
});

app.post("/api/notes", function(req, res) {
  notes.push(req.body);
  fs.writeFileSync(outputPath, notes);
  res.json(req.body);
}); 

app.listen(PORT, console.log("Server starting on PORT ", PORT));