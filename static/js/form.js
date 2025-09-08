$(document).ready(function () {
    // toggle head wedding date 
    $('#wedding_date').hide();
    $('input[name="marital_status"]').on('change', function () {
        if ($(this).val().toLowerCase() === "married") {
            $('#wedding_date').show();
        } else {
            $('#wedding_date').hide();
        }
    });

    // toggle member wedding date 

    // $('.member-wed').hide();
    // $('#member-container .member-row .member-wed input[type="radio]').on('change', function () {
    //     if ($(this).val().toLowerCase() === "married") {
    //         $('.member-wed').show();
    //     } else {
    //         $('.member-wed').hide();
    //     }
    // });

    // Add Hobby
    // let formIdx = {{ formset.total_form_count|add:"-1" }};
    let formIdx = $('#id_hobbies-TOTAL_FORMS').val(); 

    $('#addHobby').click(function() {
        let lastInput = $('#hobby-container .hobby-row:last input[type="text"]'); 
        if (lastInput.val().trim() === "") { 
            alert("Please fill the current hobby before adding a new one."); 
            lastInput.focus(); 
            return; 
        }
        $('#hobby-container').append($('#hobby-container .hobby-row:last').clone().find('input').each(function() {
            let name = $(this).attr('name').replace(/-\d+-/, '-' + formIdx + '-');
            let id = $(this).attr('id').replace(/-\d+-/, '-' + formIdx + '-');	
            $(this).attr('name', name);  
            $(this).attr('id', id);
            $(this).val('');
            }).end().find('input[name$=-id]').val('').end().find('.removeHobby').show().end());

        formIdx++;       
        $('#id_hobbies-TOTAL_FORMS').val(formIdx);
    });

    $('#hobby-container').on('click', '.removeHobby', function() {
        $(this).closest('.hobby-row').remove();
        formIdx--; 
        $('#id_form-TOTAL_FORMS').val(formIdx);
    });
    $('.removeHobby').hide();

    // Add Member 
    let memberIdx = $('#id_members-TOTAL_FORMS').val(); 

    $('#addMember').click(function() {
        let lastInput = $('#member-container .member-row:last input[type="text"]'); 
        if (lastInput.val().trim() === "") { 
            alert("Please fill the current member before adding a new one."); 
            lastInput.focus(); 
            return; 
        }
        $('#member-container').append($('#member-container .member-row:last').clone().find('input').each(function() {
            let name = $(this).attr('name').replace(/-\d+-/, '-' + memberIdx + '-');
            let id = $(this).attr('id').replace(/-\d+-/, '-' + memberIdx + '-');	
            $(this).attr('name', name);  
            $(this).attr('id', id);
            $(this).val('');
            }).end().find('input[name$=-id]').val('').end().find('.removeMember').show().end());

        memberIdx++;       
        $('#id_members-TOTAL_FORMS').val(memberIdx);
    });

    $('#member-container').on('click', '.removeMember', function() {
        $(this).closest('.member-row').remove();
        memberIdx--; 
        $('#id_members-TOTAL_FORMS').val(memberIdx);
    });
    $('.removeMember').hide();
    
});
const memberrow = document.querySelectorAll('.member-row')
console.log(memberrow)

const radiobtn = document.querySelectorAll('input[type="radio"]');
console.log(radiobtn);
const member_wedDate = document.querySelector(".member-wed");
console.log(member_wedDate)
radiobtn.forEach(function(radio) {
    radio.addEventListener('change', function() {
        console.log(radio);
        console.log(this.value);

        if (this.value.toLowerCase() === "married"){
            member_wedDate.style.display = 'block';
        } else {
            member_wedDate.style.display = 'none';
        }
    }) 
});


    // In a <script> tag within your template or a linked .js file
    // document.addEventListener('DOMContentLoaded', function() {
    //     document.querySelectorAll('input[type="radio"][name$="-choice_field"]').forEach(function(radio) {
    //         radio.addEventListener('change', function() {
    //             const formRow = this.closest('.form-row');
    //             const toggledContent = formRow.querySelector('.toggled-content');

    //             if (this.value === 'option2' && this.checked) { // Assuming 'option2' triggers the toggle
    //                 toggledContent.style.display = 'block';
    //             } else {
    //                 toggledContent.style.display = 'none';
    //             }
    //         });
    //     });
    // });