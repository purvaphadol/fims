  const form = document.getElementById("forgotForm");
  console.log(form);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    const formData = new FormData(form);
    try {
      const response = await fetch("/forgot_password/", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log(result);

      if (!result.success) {
        for (const field in result.errorMessage) {
          setErrorMsg(document.getElementById(result.field), result.errorMessage);
        }
      } else if (result.success === true) {
        // alert(result.message);
        window.location.href = result.redirectURL;
        form.reset();
      } else {
        console.log("Something went wrong.", err);
      }
    } catch (err) {
      console.log("Something went wrong.", err);
    }
  });

  const validateForm = () => {
    let isValid = true;
    email = document.getElementById("email");
    const emailVal = email.value.trim();
    // Email Validation
    if (emailVal === "") {
      setErrorMsg(email, "Email is Required.");
      isValid = false;
    }
    return isValid;
  }

  function setErrorMsg(input, errorMsg) {
    const inputField = input.parentElement;
    const span = inputField.querySelector("span");
    span.classList.add("errorMsg");
    input.classList.add("errorInput");
    span.innerText = errorMsg;
  }
  function clearError(input) {
    const inputField = input.parentElement;
    const span = inputField.querySelector("span");
    if (span) span.innerText = "";
    input.classList.remove("errorInput");
  }

  const inputs = document.querySelectorAll("#forgotForm input");
  inputs.forEach(input => {
    input.addEventListener("input", () => clearError(input));
  });