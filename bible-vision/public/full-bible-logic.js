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
    let isAnimating = false;


  function loadBooks() {
    var resp = xhrJSON("GET", "/api/books");
    if (resp && resp.ok && Array.isArray(resp.items)) {
      books = resp.items;
      loadCurrentChapter();
    }
  }

  

  function displayChapter(chapter, direction) {
    const leftPage = el("leftPage");
    const rightPage = el("rightPage");
    const bookEl = document.getElementById('book');
    
    if (!leftPage || !rightPage || !bookEl) return;
    
    // Add animation class based on direction
    if (direction && !isAnimating) {
      isAnimating = true;
      bookEl.classList.add(direction === 'next' ? 'turning-next' : 'turning-prev');
      
      // Remove animation class after animation completes (1 second)
      setTimeout(() => {
        bookEl.classList.remove('turning-next', 'turning-prev');
        isAnimating = false;
      }, 1000);
    }
    
    if (!chapter || !chapter.ok) {
      setTimeout(() => {
        leftPage.innerHTML = '<p class="text-center text-carbon-black">Error loading chapter</p>';
        rightPage.innerHTML = '';
      }, direction ? 500 : 0);
      return;
    }

    if (!chapter.verses || !Array.isArray(chapter.verses)) {
      setTimeout(() => {
        leftPage.innerHTML = '<p class="text-center text-carbon-black">No verses found</p>';
        rightPage.innerHTML = '';
      }, direction ? 500 : 0);
      return;
    }

    // Update content at the midpoint of animation (when page is "hidden")
    const updateContent = () => {
      // Create chapter title
      const title = `<div class="text-2xl font-bold text-carbon-black mb-6 text-center border-b-2 border-spicy-paprika pb-2">${chapter.book} ${chapter.chapter}</div>`;
      
      // Split verses into two pages
      const midpoint = Math.ceil(chapter.verses.length / 2);
      
      // Format left page (first half of verses)
      let leftContent = title;
      for (let i = 0; i < midpoint; i++) {
        let verse = chapter.verses[i].trim();
        if (verse) {
          leftContent += `<span class="verse-number text-spicy-paprika font-semibold">${i + 1}</span>${verse} `;
        }
      }
      
      // Format right page (second half of verses)
      let rightContent = '';
      for (let i = midpoint; i < chapter.verses.length; i++) {
        let verse = chapter.verses[i].trim();
        if (verse) {
          rightContent += `<span class="verse-number text-spicy-paprika font-semibold">${i + 1}</span>${verse} `;
        }
      }
      
      leftPage.innerHTML = leftContent;
      rightPage.innerHTML = rightContent;
      
      // Reset scroll position
      leftPage.parentElement.scrollTop = 0;
      rightPage.parentElement.scrollTop = 0;
    };

    if (direction) {
      setTimeout(updateContent, 500); // Update at midpoint of 1s animation
    } else {
      updateContent(); // No animation on initial load
    }
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

  function loadCurrentChapter(direction) {
  if (books.length === 0) return;
  
  const book = books[currentBookIndex].book;
  const resp = xhrJSON("GET", "/api/chapter" + toQuery({ book: book, chapter: currentChapter }));
  
  displayChapter(resp, direction);
  updateLocation();
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
  
  loadCurrentChapter('next'); // Pass 'next' direction
}

function prevChapter() {
  if (books.length === 0) return;
  
  if (currentChapter > 1) {
    currentChapter--;
  } else if (currentBookIndex > 0) {
    currentBookIndex--;
    currentChapter = books[currentBookIndex].chapters;
  }
  
  loadCurrentChapter('prev'); // Pass 'prev' direction
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