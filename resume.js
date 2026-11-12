(function () {
  "use strict";
  const print = document.getElementById("resumePrint");
  if (print) print.addEventListener("click", () => window.print());

  // If the PDF file is not there yet, fall back to the browser's print dialog.
  const pdf = document.getElementById("resumePdf");
  if (pdf) {
    fetch(pdf.getAttribute("href"), { method: "HEAD" })
      .then((r) => { if (!r.ok) throw new Error("missing"); })
      .catch(() => {
        pdf.removeAttribute("download");
        pdf.removeAttribute("href");
        pdf.setAttribute("role", "button");
        pdf.style.cursor = "pointer";
        pdf.textContent = "Print / Save as PDF";
        pdf.addEventListener("click", () => window.print());
        if (print) print.hidden = true;
      });
  }
  if (window.SiteStore) window.SiteStore.unlock("resume_viewer");
})();
