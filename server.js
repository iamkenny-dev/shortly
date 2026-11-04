const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.urlencoded({ extended: false }));

let links = {};
if (fs.existsSync("links.json")) {
  try {
    const savedText = fs.readFileSync("links.json", "utf8");
    links = JSON.parse(savedText);
  } catch {
    console.log("links.json is empty or broken, starting with no links.");
  }
}

const codeFor = {};
for (const code in links) {
  const longUrl = links[code];
  codeFor[longUrl] = code;
}

function saveLinks() {
  const text = JSON.stringify(links, null, 2);
  fs.writeFileSync("links.json", text);
}

function cleanUpUrl(text) {
  if (typeof text !== "string") return null;

  let cleaned = text.trim();

  const lower = cleaned.toLowerCase();
  if (!lower.startsWith("http://") && !lower.startsWith("https://")) {
    cleaned = "https://" + cleaned;
  }

  try {
    const url = new URL(cleaned);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    if (!url.hostname.includes(".")) return null;
    if (url.username || url.password) return null;
    return url.href;
  } catch {
    return null;
  }
}

function makeCode() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    const randomPosition = Math.floor(Math.random() * characters.length);
    code = code + characters[randomPosition];
  }
  return code;
}

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
  res.send("My name is Kenny. I built this URL shortener with Node.js and Express.");
});

app.post("/shorten", (req, res) => {
  const longUrl = cleanUpUrl(req.body.url);

  if (!longUrl) {
    res
      .status(400)
      .send(
        'That does not look like a web address. Try something like zebra.com. <a href="/">Try again</a>',
      );
    return;
  }

  let code = codeFor[longUrl];

  if (!code) {
    code = makeCode();
    links[code] = longUrl;
    codeFor[longUrl] = code;
    saveLinks();
  }

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
