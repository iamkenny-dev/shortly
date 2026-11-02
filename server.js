const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello! My server is alive.");
});

app.get("/about", (req, res) => {
  res.send("Hello! I'm Kenny.");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000/about");
});
