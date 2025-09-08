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
    // $('input[name="members_0_member_marital"]').on('change', function () {
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