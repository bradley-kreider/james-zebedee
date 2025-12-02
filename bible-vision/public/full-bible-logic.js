(function () {
  "use strict";

  // ---------- tiny DOM helpers ----------
  function el(id) {
    return document.getElementById(id);
  }
  var out = el("out");

  let currentBookIndex = 0;
  let currentChapter = 1;
  let books = [];

  function loadBooks() {
    var resp = xhrJSON("GET", "/api/books");
    if (resp && resp.ok && Array.isArray(resp.items)) {
      books = resp.items;
      loadCurrentChapter();
    }
  }

  function loadCurrentChapter() {
    if (books.length === 0) return;
    
    const book = books[currentBookIndex].book;
    const resp = xhrJSON("GET", "/api/chapter" + toQuery({ book: book, chapter: currentChapter }));
    
    displayChapter(resp);
    updateLocation();
  }

  function displayChapter(chapter) {
    const out = el("out") || createOutputElement();
    
    if (!chapter || !chapter.ok) {
      out.textContent = chapter.error || "Error loading chapter";
      return;
    }

    if (!chapter.verses || !Array.isArray(chapter.verses)) {
      out.textContent = "No verses found";
      return;
    }

    let content = chapter.book + " " + chapter.chapter + "\n\n";

    for (let i = 0; i < chapter.verses.length; i++) {
      let verse = chapter.verses[i].trim();
      if (verse) {
        content += (i + 1) + ". " + verse + "\n\n";
      }
    }
    
    out.textContent = content;
  }

  function createOutputElement() {
    const out = document.createElement("pre");
    out.id = "out";
    out.className = "max-w-4xl mx-auto px-6 py-8 text-dust-grey whitespace-pre-wrap";
    document.body.appendChild(out);
    return out;
  }

  function updateLocation() {
    const locationEl = el("location");
    if (locationEl && books.length > 0) {
      locationEl.textContent = books[currentBookIndex].book + " " + currentChapter;
    }
  }

  function nextChapter() {
    if (books.length === 0) return;
    
    const maxChapters = books[currentBookIndex].chapters;
    
    if (currentChapter < maxChapters) {
      currentChapter++;
    } else if (currentBookIndex < books.length - 1) {
      currentBookIndex++;
      currentChapter = 1;
    }
    
    loadCurrentChapter();
  }

  function prevChapter() {
    if (books.length === 0) return;
    
    if (currentChapter > 1) {
      currentChapter--;
    } else if (currentBookIndex > 0) {
      currentBookIndex--;
      currentChapter = books[currentBookIndex].chapters;
    }
    
    loadCurrentChapter();
  }
  




function homepage() {
    window.location.href = "/index.html";
  }


function wire() {
    el("homepage").addEventListener("click", homepage);
    el("prevBtn").addEventListener("click", prevChapter);
    el("nextBtn").addEventListener("click", nextChapter);
}

function boot() {
    wire();
    loadBooks();
}


if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

})();