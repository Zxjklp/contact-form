const form = document.querySelector("#contact-form");
const successMessage = document.querySelector("#success-message");
const errorMessages = document.querySelectorAll(".form__error-message");

// Hide the error messages initially
errorMessages.forEach((msg) => (msg.style.display = "none"));

// Add click handlers to radio option containers
const radioOptions = document.querySelectorAll(".form__radio-option");
radioOptions.forEach((option) => {
  option.addEventListener("click", function () {
    const radioButton = this.querySelector(".form__radio-input");
    radioButton.checked = true;

    // Update selected state for all options
    radioOptions.forEach((opt) => {
      opt.classList.remove("selected");
    });
    this.classList.add("selected");

    // Clear error message when selecting a radio option
    const radioGroup = this.closest(".form__radio-group");
    if (radioGroup) {
      let formGroup = radioGroup;
      while (formGroup && !formGroup.classList.contains("form__group")) {
        formGroup = formGroup.parentElement;
      }

      if (formGroup) {
        // Clear error message
        const errorMessage = formGroup.querySelector(".form__error-message");
        if (errorMessage) {
          errorMessage.style.display = "none";
        }

        // Reset border colors for all radio options
        formGroup.querySelectorAll(".form__radio-option").forEach((opt) => {
          opt.style.borderColor = "var(--color-grey-500)";
        });
      }
    }
  });
});

// Function to clear error state for an element
function clearErrorState(element) {
  // Find the form group containing the element
  let formGroup = element;
  while (formGroup && !formGroup.classList.contains("form__group")) {
    formGroup = formGroup.parentElement;
  }

  // If form group exists, clear the error message and border
  if (formGroup) {
    const errorMessage = formGroup.querySelector(".form__error-message");
    if (errorMessage) {
      errorMessage.style.display = "none";
    }

    // Reset border color for the input or radio options
    if (element.classList.contains("form__radio-input")) {
      // For radio buttons, need to clear all options in the group
      const radioGroup = formGroup.querySelector(".form__radio-group");
      if (radioGroup) {
        radioGroup.querySelectorAll(".form__radio-option").forEach((option) => {
          option.style.borderColor = "var(--color-grey-500)";
        });
      }
    } else if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
      if (element.type === "checkbox") {
        // For checkbox, we don't need to change any border
      } else {
        element.style.borderColor = "var(--color-grey-500)";
      }
    }
  }
}

// Add input event listeners to text fields
document
  .querySelectorAll('input[type="text"], input[type="email"], textarea')
  .forEach((input) => {
    input.addEventListener("input", function () {
      clearErrorState(this);
    });
  });

// Add change event listeners to radio buttons and checkbox
document
  .querySelectorAll('input[type="radio"], input[type="checkbox"]')
  .forEach((input) => {
    input.addEventListener("change", function () {
      clearErrorState(this);
    });
  });

// Function to validate the form data
// This function checks if all required fields are filled and valid
function validateForm(data) {
  let isValid = true;

  // Check first name
  if (!data["first-name"]) {
    const firstNameField = document.querySelector("#first-name");
    firstNameField.parentElement.querySelector(".form__error-message").style.display =
      "block";
    firstNameField.style.borderColor = "var(--color-red)";
    isValid = false;
  }

  // Check last name
  if (!data["last-name"]) {
    const lastNameField = document.querySelector("#last-name");
    lastNameField.parentElement.querySelector(".form__error-message").style.display =
      "block";
    lastNameField.style.borderColor = "var(--color-red)";
    isValid = false;
  }

  // Check email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data["email"] || !emailRegex.test(data["email"])) {
    const emailField = document.querySelector("#email");
    emailField.parentElement.querySelector(".form__error-message").style.display =
      "block";
    emailField.style.borderColor = "var(--color-red)";
    isValid = false;
  }

  // Check query type
  if (!data["query-type"]) {
    const radioGroup = document.querySelector(".form__radio-group");
    radioGroup.parentElement.querySelector(".form__error-message").style.display =
      "block";
    document.querySelectorAll(".form__radio-option").forEach((option) => {
      option.style.borderColor = "var(--color-red)";
    });
    isValid = false;
  }

  // Check message
  if (!data["message"]) {
    const messageField = document.querySelector("#message");
    messageField.parentElement.querySelector(".form__error-message").style.display =
      "block";
    messageField.style.borderColor = "var(--color-red)";
    isValid = false;
  }

  // Check consent
  if (!data["consent"]) {
    const consentField = document.querySelector("#consent");
    const consentFormGroup = consentField.closest(".form__group");
    if (consentFormGroup) {
      const errorMessage = consentFormGroup.querySelector(".form__error-message");
      if (errorMessage) {
        errorMessage.style.display = "block";
      }
    }
    isValid = false;
  }

  return isValid;
}

// This function handles the form submission event
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission behavior

  // Hide success message if it was previously shown
  successMessage.style.display = "none";

  // Hide all error messages first
  errorMessages.forEach((msg) => {
    msg.style.display = "none";
  });

  // Reset all input border colors
  document 
    .querySelectorAll("input, textarea, .form__radio-option")
    .forEach((element) => {
      if (element.classList.contains("form__radio-option")) {
        element.style.borderColor = "var(--color-grey-500)";
      } else if (element.type !== "checkbox" && element.type !== "radio") {
        element.style.borderColor = "var(--color-grey-500)";
      }
    });

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Validate the form data
  if (validateForm(data)) {
    // Show the success message if validation passes
    successMessage.style.display = "block";

    // Ensure the success message is visible
    successMessage.scrollIntoView({ behavior: "smooth", block: "center" });

    // Reset the selected state for radio options
    radioOptions.forEach((opt) => {
      opt.classList.remove("selected");
    });

    form.reset(); // Reset the form fields
  }
});