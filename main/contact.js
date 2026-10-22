
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // COPY EMAIL BUTTON
  // ==========================================

  const copyEmailBtn = document.getElementById("copyEmailBtn");
  const copyEmailText = document.getElementById("copyEmailText");
  const contactEmail = "shanevincentolavario@gmail.com";

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(contactEmail);
        } else {
          const temporaryInput = document.createElement("textarea");

          temporaryInput.value = contactEmail;
          temporaryInput.setAttribute("readonly", "");
          temporaryInput.style.position = "fixed";
          temporaryInput.style.left = "-9999px";

          document.body.appendChild(temporaryInput);
          temporaryInput.select();

          const successful = document.execCommand("copy");
          temporaryInput.remove();

          if (!successful) {
            throw new Error("Copy command failed");
          }
        }

        if (copyEmailText) {
          copyEmailText.textContent = "Email Copied!";
        }

        copyEmailBtn.classList.add("copied");
        copyEmailBtn.setAttribute(
          "aria-label",
          "Email copied to clipboard"
        );

        setTimeout(() => {
          if (copyEmailText) {
            copyEmailText.textContent = "Copy Email";
          }

          copyEmailBtn.classList.remove("copied");
          copyEmailBtn.setAttribute(
            "aria-label",
            "Copy email address"
          );
        }, 2000);
      } catch (error) {
        window.prompt("Copy this email address:", contactEmail);
      }
    });
  }

  // ==========================================
  // CONTACT FORM ELEMENTS
  // ==========================================

  const contactForm = document.getElementById("contactForm");

  if (!contactForm) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const subjectInput = document.getElementById("subject");
  const messageInput = document.getElementById("message");
  const formStatus = document.getElementById("formStatus");
  const characterCounter = document.getElementById("characterCounter");

  // ==========================================
  // FIELD VALIDATION MESSAGES
  // ==========================================

  function showError(input, errorId, message) {
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.textContent = message;
    }

    if (input) {
      input.classList.toggle("input-invalid", Boolean(message));

      if (message) {
        input.setAttribute("aria-invalid", "true");
      } else {
        input.removeAttribute("aria-invalid");
      }
    }
  }

  function validateForm() {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value;
    const message = messageInput.value.trim();

    const nameError =
      name.length < 2
        ? "Please enter at least 2 characters."
        : name.length > 80
          ? "Name must be 80 characters or fewer."
          : "";

    const emailError =
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Please enter a valid email address."
        : "";

    const subjectError = !subject
      ? "Please select a subject."
      : "";

    const messageError =
      message.length < 10
        ? "Please enter at least 10 characters."
        : message.length > 500
          ? "Message must be 500 characters or fewer."
          : "";

    showError(nameInput, "nameError", nameError);
    showError(emailInput, "emailError", emailError);
    showError(subjectInput, "subjectError", subjectError);
    showError(messageInput, "messageError", messageError);

    return !(
      nameError ||
      emailError ||
      subjectError ||
      messageError
    );
  }

  // ==========================================
  // LIVE CHARACTER COUNTER
  // ==========================================

  function updateCharacterCounter() {
    if (!characterCounter || !messageInput) return;

    characterCounter.textContent =
      `${messageInput.value.length} / 500 characters`;
  }

  if (messageInput) {
    messageInput.addEventListener("input", () => {
      updateCharacterCounter();

      if (messageInput.value.trim().length >= 10) {
        showError(messageInput, "messageError", "");
      }
    });
  }

  updateCharacterCounter();

  // ==========================================
  // CLEAR ERRORS WHILE TYPING
  // ==========================================

  nameInput.addEventListener("input", () => {
    const name = nameInput.value.trim();

    if (name.length >= 2 && name.length <= 80) {
      showError(nameInput, "nameError", "");
    }
  });

  emailInput.addEventListener("input", () => {
    const email = emailInput.value.trim();

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError(emailInput, "emailError", "");
    }
  });

  subjectInput.addEventListener("change", () => {
    if (subjectInput.value) {
      showError(subjectInput, "subjectError", "");
    }
  });

  // ==========================================
  // SEND MESSAGE THROUGH GMAIL
  // ==========================================

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      if (formStatus) {
        formStatus.textContent =
          "Please correct the errors above.";
        formStatus.className = "form-status error";
      }

      contactForm.querySelector(".input-invalid")?.focus();
      return;
    }

    const name = nameInput.value.trim();
    const senderEmail = emailInput.value.trim();
    const subject = subjectInput.value;
    const message = messageInput.value.trim();

    const recipient = "shanevincentolavario@gmail.com";

    const emailBody =
      `Name: ${name}\n` +
      `Email: ${senderEmail}\n\n` +
      `Message:\n${message}`;

    const gmailURL =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      `&to=${encodeURIComponent(recipient)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(emailBody)}`;

    window.open("https://mail.google.com/mail/u/0/#inbox", "_blank");

    if (formStatus) {
      formStatus.textContent =
        "Opening Gmail with your message prepared. Click Send in Gmail to send it.";
      formStatus.className = "form-status success";
    }

    window.open("https://mail.google.com/", "_blank");
  });
});
