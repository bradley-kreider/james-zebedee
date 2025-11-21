// public/logic.js
(function () {
  "use strict";

  // ---------- tiny DOM helpers ----------
  function el(id) {
    return document.getElementById(id);
  }
  var out = el("out");

  function show(obj) {
    try {
      out.textContent = JSON.stringify(obj, null, 2);
    } catch (e) {
      out.textContent = String(obj);
    }
  }

  function toQuery(params) {
    if (!params) return "";
    var usp = new URLSearchParams();
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k)) {
        var v = params[k];
        if (v !== undefined && v !== null && v !== "") usp.append(k, String(v));
      }
    }
    var s = usp.toString();
    return s ? "?" + s : "";
  }

  // ---------- synchronous XHR (no fetch, no promises) ----------
  function xhrJSON(method, url) {
    var xhr = new XMLHttpRequest();
    try {
      xhr.open(method, url, false); // synchronous
      xhr.setRequestHeader("Accept", "application/json");
      xhr.send(null);
    } catch (e) {
      return { ok: false, status: 0, error: "Network error: " + String(e) };
    }
    var status = xhr.status;
    var text = xhr.responseText || "";
    try {
      var data = JSON.parse(text);
      if (typeof data === "object" && data && !("status" in data)) data.status = status;
      return data;
    } catch (e) {
      return { ok: false, status: status, error: "Invalid JSON", raw: text };
    }
  }

  // ---------- current inputs ----------
  function currentBook() {
    return el("bookSel").value || "";
  }
  function currentChapter() {
    return Number(el("chapterInp").value || 0);
  }

  function currentVerse() {
    return Number(el("verseInp").value || 0);
  }

  function currentQuery() {
    return el("searchInp").value || "";
  }

  // ---------- example actions ----------
  function loadHealth() {
    show(xhrJSON("GET", "/api/health"));
  }

  function loadBooks() {
    var resp = xhrJSON("GET", "/api/books");
    // show(resp);
    if (resp && resp.ok && Array.isArray(resp.items)) populateBooks(resp.items);
  }

  function randomVerse() {
    var book = currentBook();
    var ch = currentChapter();
    console.log(book,ch);
    var params = {};
    if (book) params.book = book;
    if (ch) params.chapter = ch;
    var resp = xhrJSON("GET", "/api/verse/random" + toQuery(params));
    out.textContent = (displayVerse(resp));
  }

  function loadChapter() {
    var book = currentBook(); 
    var ch = currentChapter();
    console.log(book,ch);
    if (!book || !ch) {
        return show({ ok: false, error: "Please select a book and enter a chapter number." });
      }
    if(currentVerse()) {
      loadVerse();
    } else {
      var resp = xhrJSON("GET", "/api/chapter" + toQuery({ book: book, chapter: ch }));
      out.textContent = displayChapter(resp);
    }
  }
  
  function loadVerse() {
    var book = currentBook();
    var ch = currentChapter();
    var verse = currentVerse();
    console.log(book,ch,verse);

    if(!book || !ch || !verse) {
      return show({ ok: false, error: "Please select a book and enter a chapter number and verse." });
    }

    var resp = xhrJSON("GET", "/api/verse" + toQuery({ book: book, chapter: ch, verse: verse }));
    out.textContent = displayVerse(resp);
  }


  // ---------- populate selects ----------
  function populateBooks(items) {
    var sel = el("bookSel");
    sel.innerHTML = '<option value="">(none)</option>';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var opt = document.createElement("option");
      opt.value = it.book;
      opt.textContent = it.book + " (" + it.chapters + ")";
      sel.appendChild(opt);
    }
  }


  function displayChapter(chapter) {
    if(!chapter || !chapter.ok) {
      out.textContent = chapter.error || "Error loading chapter";
      return;
    }

    if (!chapter.verses || !Array.isArray(chapter.verses)) {
      out.textContent = "No verses found";
      return;
    }

    var content = chapter.book + " " + chapter.chapter + "\n\n";

    for(let i = 0; i < chapter.verses.length; i++) {
      let verse = chapter.verses[i].trim();
      if(verse) {
        content += (i+1) + ". " + verse + "\n\n";
      }
    }
    return content;
  }


  function displayVerse(data) {
    if(!data || !data.ok) {
      return data.error || "Error loading verse";
    }

    if (!data.text) {
      out.textContent = "No verse text found";
      return;
    }

    var content = data.book + " " + data.chapter + ":" + data.verse + "\n\n" + data.text;

    return content;

  }

  function displaySearch(data) {
    if(!data || !data.ok) {
      return show({ ok: false, error: data.error || "Search failed" });
    }

    if (!data.items || data.items.length === 0) {
      out.textContent = "No results found for: " + data.q;
      return;
    }

    let content = "Search results for '" + data.q + "' (" + data.count + " found):\n\n";
  
    for (let i = 0; i < data.items.length; i++) {
      let item = data.items[i];
      content += item.book + " " + item.chapter + ":" + item.verse + "\n";
      content += item.text + "\n\n";
    }
  
    out.textContent = content;
  }

  function search() {
    let query = currentQuery();

    if(!query) {
      return(show({ok: false, error: "No query provided"}));
    }

    let params = {q: query};
    var resp = xhrJSON("GET", "/api/search" + toQuery(params));
    displaySearch(resp);

  }

  // ---------- wire UI ----------
  function wire() {
    el("btnRandom").addEventListener("click", randomVerse);

    el("load").addEventListener("click", loadChapter);

    el("btnSearch").addEventListener("click", search)

    // TODO students:
    // - Add buttons/inputs and hook them to:
    //   - /api/chapter?book=CODE&chapter=N
    //   - /api/chapter/verses?book=CODE&chapter=N
    //   - /api/search?q=term&book=CODE&limit=25
    //   - /api/range?book=CODE&from=A&to=B
    //   - /api/files, /api/stats, /api/book/meta, /api/book/chapters
  }

  // ---------- boot ----------
  function boot() {
    // loadHealth(); // show something on first load
    loadBooks(); // populate book select
    wire();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();




//todo
//verse numbers are not matching up correctly (verse 6 is appearing as verse 5)