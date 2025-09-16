const form = document.getElementById("familyForm");
const name = document.getElementById("id_name");
const surname = document.getElementById("id_surname");
const dob = document.getElementById("id_dob");
const mobno = document.getElementById("id_mobno");
const address = document.getElementById("id_address");
// const state = document.getElementById("id_state");
const city = document.getElementById("id_city");
const pincode = document.getElementById("id_pincode");
const marital_status = document.getElementById("id_marital_status")
// console.log(marital_status)
const photo = document.getElementById("id_photo");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const isValid = validateForm();
  if (!isValid) return;
  const formData = new FormData(form);
  try {
    const response = await fetch("/family_form/", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log(result);
    document.querySelectorAll('.errorMsg').forEach(span => span.innerText = '');
    document.querySelectorAll('.errorInput').forEach(input => input.classList.remove('errorInput'));

    if (!result.success) {
      // Head form errors
      if (result.head_errors) {
        for (const field in result.head_errors) {
          const input = document.querySelector(`[name="${field}"]`);
          if (input) {
            setErrorMsg(input, result.head_errors[field][0]);
          }
        }
      }
      // Hobby formset errors
      if (Array.isArray(result.hobby_errors)) {
        result.hobby_errors.forEach((formErrors, i) => {
          for (const field in formErrors) {
            const input = document.querySelector(
              `[name="hobbies-${i}-${field}"]`
            );
            if (input) {
              setErrorMsg(input, formErrors[field][0]);
            }
          }
        });
      }
      // Member formset errors
      if (Array.isArray(result.member_errors)) {
        result.member_errors.forEach((formErrors, i) => {
          for (const field in formErrors) {
            const input = document.querySelector(
              `[name="members-${i}-${field}"]`
            );
            if (input) {
              setErrorMsg(input, formErrors[field][0]);
            }
          }
        });
      }
    } else if (result.success === true) {
      console.log("true");
      // alert(result.message);
      window.location.href = "/";
      // form.reset();
    } else {
      console.log("Something went wrong.", err);
    }
  } catch (err) {
    console.log("Something went wrong.", err);
  }
});

function setErrorMsg(input, errorMsg) {
  if (!input) return;
  let inputField = input.closest("div");
  if (input.type === "radio") {
    while (inputField && !inputField.querySelector("span.errorMsg")) {
      inputField = inputField.parentElement;
    }
  }
  if (!inputField) return;
  const span = inputField.querySelector("span.errorMsg");
  if (!span) return;

  span.classList.add("errorMsg");
  input.classList.add("errorInput");
  span.innerText = errorMsg;
}

$(document).on("input", 'input[type="text"], input[type="date"], input[type="file"], select, textarea',
  function () {
    let span = $(this).parent().find(".errorMsg");
    span.text("");
    $(this).removeClass("errorInput");
  }
);

// $(document).on('change', 'input[type="radio"]', function() {
//     // Find the container with the errorMsg span
//     let container = $(this).closest('div').parent(); // adjust if needed
//     let span = container.find('.errorMsg');
//     span.text('');
//     container.find('input[type="radio"]').removeClass('errorInput');
// });

const validateForm = () => {
    validateHead();
    validateHobby();
    validateMember();
}
const validateHead = () => {
  let isValid = true;

  const nameVal = name.value.trim();
  if (nameVal === "") {
    setErrorMsg(name, "Name is Required");
    isValid = false;
  } else if (nameVal.length < 3) {
    setErrorMsg(name, "Name should have minimum 3 charaters");
    isValid = false;
  } else if (/\d/.test(nameVal)) {
    setErrorMsg(name, "Name should not contain digits");
    isValid = false;
  }

  const surnameVal = surname.value.trim();
  if (surnameVal === "") {
    setErrorMsg(surname, "Surname is Required");
    isValid = false;
  } else if (surnameVal.length < 3) {
    setErrorMsg(surname, "Surname should have minimum 3 charaters");
    isValid = false;
  } else if (/\d/.test(surnameVal)) {
    setErrorMsg(surname, "Surname should not contain digits");
    isValid = false;
  }

  const dobVal = dob.value.trim();
  const today = new Date();
  const bDate = new Date(dobVal);
  const age = today.getFullYear() - bDate.getFullYear();
  const month = today.getMonth() - bDate.getMonth();
  if (dobVal === "") {
    setErrorMsg(dob, "Date of Birth is Required");
    isValid = false;
  } else if (age < 21 || (age === 10 && month < 0)) {
    setErrorMsg(dob, "Age must be at least 21 years old.");
    isValid = false;
  }

  const mobnoVal = mobno.value.trim();
  if (mobnoVal === "") {
    setErrorMsg(mobno, "Mobile No. is Required");
    isValid = false;
  } else if (!/^\d{10}$/.test(mobnoVal)) {
    setErrorMsg(mobno, "Mobile No. should have 10 Digits.");
    isValid = false;
  }

  const addressVal = address.value.trim();
  if (addressVal === "") {
    setErrorMsg(address, "Address is Required");
    isValid = false;
  }

  const stateVal = state.value.trim();
  if (!stateVal) {
    setErrorMsg(state, "State is Required");
  }

  const cityVal = city.value.trim();
  if (!cityVal) {
    setErrorMsg(city, "City is Required");
  }

  const pincodeVal = pincode.value.trim();
  if (pincodeVal === "") {
    setErrorMsg(pincode, "Pincode is Required");
  }

  const maritalVal = document.getElementsByName("marital_status");
  if (!(maritalVal[0].checked || maritalVal[1].checked)) {
            setErrorMsg(marital_status, "Please Select Marital Status");
            isValid = false;
      } 

  const photoPathVal = photo.value;
  var allowedExtensions = /(\.jpg|\.png)$/i;
  if (photoPathVal === "") {
    setErrorMsg(photo, "Photo is Required");
    isValid = false;
  } else if (!allowedExtensions.exec(photoPathVal)) {
    setErrorMsg(photo, "Invalid file type. Only PNG, JPG are allowed");
    isValid = false;
  } else {
    var photoSize = photo.files[0].size / 1000 / 1000;
    // console.log(photoSize);
    if (photoSize > 2) {
      setErrorMsg(photo, "Photo Size should be less than 2MB");
      isValid = false;
    }
  }
};

function validateHobby() {
    let isValid = true;
    let firstHobby = $('#hobby-container .hobby-row:first input[type="text"]')[0];
    $('#hobby-container .hobby-row:first .errorMsg').text('');
    if (!firstHobby.value.trim()) {
        setErrorMsg(firstHobby, 'At least one hobby is required.');
        isValid = false;
    }
    return isValid;
}

function validateMember() {
  let isValid = true;
  let m_name = $('#member-container .member-row input[type="text"][name$="member_name"]')[0];
  if(!m_name.value.trim()) {
    setErrorMsg(m_name, 'Name is required.');
        isValid = false;
  }
  let m_dob = $('#member-container .member-row input[type="date"][name$="member_dob"]')[0];
  if(!m_dob.value.trim()) {
    setErrorMsg(m_dob, 'Birth Date is required.');
        isValid = false;
  }
  // let marital = row.find('#member-container .member-row input[type="radio"][name$="member_marital"]');
  // let maritalChecked = maritalInputs.is(':checked');
  // let wedDateInput = row.find('#member-container .member-row input[type="date"][name$="member_wedDate"]')[0];
  // if (!maritalChecked) {
  //       setErrorMsg(marital, "Please select Marital Status.");
  //       isValid = false;
  //   } else {
  //       let marriedVal = marital.filter(':checked').val();
  //       if (marriedVal && marriedVal.toLowerCase() === 'married') {
  //           if (!wedDateInput.value.trim()) {
  //               setErrorMsg(wedDateInput, "Wedding date is required if married.");
  //               isValid = false;
  //           }
  //       }
  //   }
  return isValid;
}