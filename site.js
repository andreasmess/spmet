// Enhance navigation while keeping links available when JavaScript is disabled.
document.documentElement.classList.add("js");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-navigation");
const mobileNavigation = window.matchMedia("(max-width: 1280px)");
let navigationHasFocus = false;

function setMenuOpen(open, restoreFocus = false) {
  nav.classList.toggle("active", open);
  menuToggle.classList.toggle("active", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Κλείσιμο μενού" : "Άνοιγμα μενού");
  menuToggle.querySelector(".menu-icon").textContent = open ? "×" : "☰";
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});
nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    setMenuOpen(false);
    // Move focus out of the closed menu and into the selected section.
    const target = document.getElementById(link.hash.slice(1));
    if (target) {
      target.setAttribute("tabindex", "-1");
    }
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("active")) {
    setMenuOpen(false, true);
  }
});
document.addEventListener("click", (event) => {
  if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
    setMenuOpen(false);
  }
});
document.addEventListener("focusin", (event) => {
  navigationHasFocus = nav.contains(event.target);
  if (!nav.contains(event.target) && !menuToggle.contains(event.target)) {
    setMenuOpen(false);
  }
});
mobileNavigation.addEventListener("change", () => {
  // Browsers may blur a link as soon as the mobile CSS hides the navigation.
  const focusedLink = navigationHasFocus || nav.contains(document.activeElement);
  setMenuOpen(false, mobileNavigation.matches && focusedLink);
});

// Keep fixed-header offsets correct when the logo wraps or fonts finish loading.
const header = document.querySelector("header");
function updateHeaderHeight() {
  document.documentElement.style.setProperty(
    "--header-height",
    `${header.getBoundingClientRect().height}px`
  );
}
updateHeaderHeight();
if ("ResizeObserver" in window) {
  new ResizeObserver(updateHeaderHeight).observe(header);
} else {
  window.addEventListener("resize", updateHeaderHeight);
}

// Keep the original details as a fallback; supported browsers get a wide reader.
const newsReader = document.querySelector(".news-reader");
const newsArticles = Array.from(document.querySelectorAll(".news-details[id]"));
const supportsNewsReader = typeof newsReader.showModal === "function";
let currentArticle = null;
let previousArticleHash = "#news";

function showNewsArticle(article) {
  if (!supportsNewsReader) {
    article.open = true;
    article.scrollIntoView();
    return;
  }
  if (currentArticle === article && newsReader.open) return;
  currentArticle = article;
  const card = article.closest(".news-card");
  const title = document.createElement("h2");
  title.id = "news-reader-title";
  title.textContent = card.querySelector("h3").textContent.trim();
  const photo = card.querySelector("img").cloneNode(true);
  photo.loading = "eager";
  photo.sizes = "(max-width: 900px) 90vw, 800px";
  newsReader.querySelector(".news-reader-content").replaceChildren(
    card.querySelector(".news-date").cloneNode(true),
    title,
    photo,
    article.querySelector(".news-article").cloneNode(true)
  );
  document.documentElement.classList.add("news-reader-open");
  if (!newsReader.open) newsReader.showModal();
  newsReader.scrollTop = 0;
  newsReader.querySelector(".news-reader-close").focus({ preventScroll: true });
}

if (supportsNewsReader) {
  newsArticles.forEach((article) => {
    const summary = article.querySelector("summary");
    summary.setAttribute("aria-haspopup", "dialog");
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      previousArticleHash = window.location.hash || "#news";
      history.pushState(null, "", `#${article.id}`);
      showNewsArticle(article);
    });
  });
  newsReader.querySelector(".news-reader-close").addEventListener("click", () => newsReader.close());
  let pointerStartedOutside = false;
  function outsideReader(event) {
    const bounds = newsReader.getBoundingClientRect();
    return event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
  }
  newsReader.addEventListener("pointerdown", (event) => {
    pointerStartedOutside = outsideReader(event);
  });
  newsReader.addEventListener("click", (event) => {
    if (pointerStartedOutside && outsideReader(event)) newsReader.close();
    pointerStartedOutside = false;
  });
  newsReader.addEventListener("close", () => {
    document.documentElement.classList.remove("news-reader-open");
    if (currentArticle) {
      if (window.location.hash === `#${currentArticle.id}`) {
        history.replaceState(null, "", previousArticleHash);
      }
      currentArticle.querySelector("summary").focus({ preventScroll: true });
      currentArticle = null;
    }
  });
}

function openLinkedArticle() {
  const article = newsArticles
    .find((details) => `#${details.id}` === window.location.hash);
  if (article) {
    previousArticleHash = "#news";
    showNewsArticle(article);
  } else if (supportsNewsReader && newsReader.open) {
    newsReader.close();
  }
}
window.addEventListener("hashchange", openLinkedArticle);

// Align direct section and article links after fonts and the header have settled.
window.addEventListener("load", () => {
  updateHeaderHeight();
  openLinkedArticle();
  const target = Array.from(document.querySelectorAll("main section[id]"))
    .find((section) => `#${section.id}` === window.location.hash);
  if (target) target.scrollIntoView();
});

// Without fetch support, retain the normal Formspree HTML submission flow.
const form = document.querySelector(".contact-form");
document.querySelector("[data-membership-inquiry]").addEventListener("click", () => {
  const message = form.querySelector("#message");
  if (!message.value.trim()) {
    message.value = "Ενδιαφέρομαι να γίνω μέλος του ΣΠΜΕΤ. Θα ήθελα πληροφορίες για τη διαδικασία εγγραφής και τα απαραίτητα δικαιολογητικά.";
  }
  // Let the contact anchor navigate before moving keyboard focus into the form.
  requestAnimationFrame(() => {
    form.querySelector("#name").focus({ preventScroll: true });
  });
});

if (window.fetch && window.FormData && window.AbortController) {
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".form-status");
  const message = form.querySelector(".form-status-message");
  const email = form.querySelector(".form-status-email");
  let submitting = false;

  function showStatus(state, text) {
    status.dataset.state = state;
    message.textContent = text;
    email.hidden = state !== "error";
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting || !form.reportValidity()) return;

    const body = new FormData(form);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    submitting = true;
    button.disabled = true;
    button.textContent = "Αποστολή…";
    form.setAttribute("aria-busy", "true");
    showStatus("pending", "Το μήνυμά σας αποστέλλεται…");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body,
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) {
        showStatus("error", "Η αποστολή απέτυχε. Τα στοιχεία σας διατηρήθηκαν. Δοκιμάστε ξανά ή επικοινωνήστε μέσω email.");
        return;
      }
      form.reset();
      showStatus("success", "Το μήνυμά σας στάλθηκε επιτυχώς. Ευχαριστούμε για την επικοινωνία!");
    } catch {
      showStatus("error", "Δεν μπορέσαμε να επιβεβαιώσουμε την αποστολή. Τα στοιχεία σας διατηρήθηκαν. Ελέγξτε τη σύνδεσή σας πριν δοκιμάσετε ξανά ή επικοινωνήστε μέσω email.");
    } finally {
      window.clearTimeout(timeout);
      submitting = false;
      button.disabled = false;
      button.textContent = "Αποστολή";
      form.removeAttribute("aria-busy");
    }
  });
}
