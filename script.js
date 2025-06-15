// FAQ accordion
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;
    answer.style.display = answer.style.display === "block" ? "none" : "block";
  });
});

// Toggle συνημμένα
const toggleBtn = document.getElementById("toggle-attachments");
const attachList = document.getElementById("attachments-list");
toggleBtn.addEventListener("click", () => {
  attachList.classList.toggle("hidden");
});
