const form = document.getElementById("familyForm");

form.addEventListener("submit", async (e) => {
      e.preventDefault();
    //   const isValid = validateForm(); 
    //   if (!isValid) return;
      const formData = new FormData(form);
      try {
            const response = await fetch("http://127.0.0.1:8000/family_form/", {
                  method: "POST",
                  body: formData
            });
            
            const result = await response.json();
            console.log(result);
            if (!result.success) {
                  for (const field in result.errorMessage) {
                        setErrorMsg(document.getElementById(result.field), result.errorMessage);
                  }
            } 
            else if(result.success == true) {
                  // alert(result.message); 
                  window.location.href = "/";
                  // form.reset();
            }
            else{
                  console.log("Something went wrong.", err);
            }
      } 
      catch (err) {
            console.log("Something went wrong.", err);
      }
});

function setErrorMsg(input, errorMsg) {
      const inputField = input.parentElement;
      const span = inputField.querySelector("span");
      span.classList.add("errorMsg");
      input.classList.add("errorInput");
      span.innerText = errorMsg;
}