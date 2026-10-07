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

// Open linked news articles before aligning their position below the header.
function openLinkedArticle() {
  const article = Array.from(document.querySelectorAll(".news-details[id]"))
    .find((details) => `#${details.id}` === window.location.hash);
  if (article) {
    article.open = true;
    article.scrollIntoView();
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
