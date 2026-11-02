const express = require("express");

const app = express();

function makeCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomPosition = Math.floor(Math.random() * characters.length);
    code = code + characters[randomPosition]
    // code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

app.use(express.urlencoded({ extended: false }));

const links = {};

app.get("/", (req, res) => {
  res.send(`
    <h1>Shortly</h1>
    <form method="POST" action="/shorten">
      <input name="url" placeholder="Paste a long link here" size="50">
      <button>Shorten</button>
    </form>
    `);
});

app.get("/about", (req, res) => {
  res.send("Hello! I'm Kenny.");
});

app.post("/shorten", (req, res) => {
  const longUrl = req.body.url;
  const code = makeCode();
  links[code] = longUrl;
  console.log(links);
  const shortUrl = "http://localhost:3000/" + code;
  res.send(`Your short link: <a href="${shortUrl}">${shortUrl}</a>`);
});

app.get("/:code", (req, res) => {
  const longUrl = links[req.params.code];
  if (!longUrl) {
    res.status(404).send("Sorry, that link does not exist.");
    return;
  }
  res.redirect(longUrl);
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000/about");
});
