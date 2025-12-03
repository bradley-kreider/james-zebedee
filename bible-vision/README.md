# Bible Vision

A modern web application for reading and exploring the World English Bible with an elegant, user-friendly interface.

## Overview

Bible Vision is a read-only Bible study application that provides access to the complete World English Bible through a clean, responsive web interface. The application features a Node.js backend API serving Bible text from local files and multiple frontend views for different reading experiences.

## Features

- **Full Bible Access**: Browse all books, chapters, and verses of the World English Bible
- **Search Functionality**: Search for specific terms across the entire Bible or within specific books
- **Random Verse**: Get random verses for inspiration and daily reading
- **Multiple Views**:
  - Main reading interface with verse-by-verse navigation
  - Full Bible view with page-flip animations
  - API explorer for developers
- **Responsive Design**: Modern UI built with Tailwind CSS
- **RESTful API**: Comprehensive JSON API for programmatic access

## Tech Stack

- **Backend**: Node.js (HTTP server)
- **Frontend**: HTML, JavaScript, Tailwind CSS
- **Testing**: Playwright
- **Fonts**: Inter (Google Fonts)

## Project Structure

```
bible-vision/
├── public/              # Frontend files
│   ├── index.html       # Main reading interface
│   ├── logic.js         # Main UI logic
│   ├── full-bible.html  # Full Bible reading view
│   ├── full-bible-logic.js
│   ├── api.html         # API explorer
│   ├── api-logic.js
│   └── style.css        # Tailwind output
├── world_english_bible/ # Bible text files (*.txt)
├── data/                # Additional data storage
├── tests/               # Playwright tests
├── tailwind/            # Tailwind source files
├── server.js            # Node.js API server
├── package.json
└── README.md

```

### Start the Server

```bash
npm start
```

The server will start on port 4101 by default. Access the application at:
- Main interface: http://127.0.0.1:4101/
- Full Bible view: http://127.0.0.1:4101/full-bible.html
- API explorer: http://127.0.0.1:4101/api.html

```

### Development

Build Tailwind CSS (watch mode):
```bash
npm run tailwind
```

Run tests:
```bash
npm test
```


## File Format

Bible text files follow the pattern: `###_BOOK_##.txt`

- First 3 digits: Book order number (e.g., `002` for Genesis)
- Book code: 2-3 letter abbreviation (e.g., `GEN`, `1KI`, `2CO`)
- Chapter: 2-3 digit chapter number (e.g., `01`, `150`)

Example: `002_GEN_01.txt` (Genesis Chapter 1)

## Book Codes

Common book abbreviations:
- Old Testament: `GEN`, `EXO`, `LEV`, `NUM`, `DEU`, `PSA`, `PRO`, `ISA`, etc.
- New Testament: `MAT`, `MRK`, `LUK`, `JHN`, `ACT`, `ROM`, `1CO`, `2CO`, `REV`, etc.



## Contributing

This is a personal project for James Zebedee (Bradley Kreider). If you'd like to contribute or use this for your own purposes, feel free to fork the repository.


## Author

Bradley Kreider (James Zebedee)