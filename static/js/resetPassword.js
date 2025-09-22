const form = document.getElementById("resetPassForm");
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    const formData = new FormData(form);
    const pk = document.getElementById("pk").value;
    try {
        const response = await fetch(`/reset_password/${pk}/`, {
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
            alert(result.message);
            window.location.href = "/login/";
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
    password = document.getElementById("password");
    const passwordVal = password.value.trim();
    // Password Validation
    const passRegex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (passwordVal === "") {
        setErrorMsg(password, "Password is required.");
        isValid = false;
    } else if (!passRegex.test(passwordVal)) {
        setErrorMsg(password, "Password must have 8+ chars, 1 Uppercase, 1 Number, 1 Special Char.");
        isValid = false;
    }

    con_password = document.getElementById("confirm_password");
    const c_passwordVal = con_password.value.trim();
    // Conform Password Validation
    if (c_passwordVal === "") {
        setErrorMsg(con_password, "Confirm Password is required.");
        isValid = false;
    } else if (passwordVal != c_passwordVal) {
        setErrorMsg(con_password, "Passwords do not match.");
        isValid = false;
    }
    return isValid;
}

function setErrorMsg(input, errorMsg) {
    if (!input) return;
    let inputField = input.closest("div");
    if (!inputField) return;
    const span = inputField.querySelector("span.errorMsg");
    if (!span) return;
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

const inputs = document.querySelectorAll("#resetPassForm input");
inputs.forEach((input) => {
    input.addEventListener("input", () => clearError(input));
});

