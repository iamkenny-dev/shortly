"# shortly"

# Shortly

A URL shortener built with Node.js and Express, like a mini bit.ly.

## Features
- Turns long links into short 6-character codes
- Accepts links with or without https:// (e.g. google.com)
- Rejects invalid and unsafe links (like javascript: links)
- Returns the same code if a link is shortened twice
- Saves links to a file so they survive a restart
- Uses a reverse lookup table for fast duplicate checks


## Run it
npm install
node server.js

Then open http://localhost:3000


