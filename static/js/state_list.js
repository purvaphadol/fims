$(document).ready(function () {
    $(document).on('click', '.pagination a.page-link', function (e) {
        e.preventDefault();
        const url = $(this).attr('href');
        loadPage(url);
    });

    $("#search-form").on('submit', function (e) {
        e.preventDefault();
        const search = $("#search").val();
        const url = `?search=${search}`;
        loadPage(url);
    });

    $("#search-form").on('keyup', function (e) {
        e.preventDefault();
        const search = $("#search").val();
        const exurl = `/state_excel/`;
        const url = `?search=${search}`;
        const newURL = exurl + url;
        $("#excelURL").attr('href', newURL);

        if (search === "") {
            const url = $(this).attr('href');
            loadPage(url);
        }
    });
});


function loadPage(url) {
    $.ajax({
        url: url,
        type: 'GET',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        success: function (data) {
            $('#ajax-table').html(data.state_html);
        },
        error: function (xhr, status, error) {
            console.error("AJAX Error:", error);
        }
    });
}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


async function confirmDelete(deleteUrl) {
    console.log(deleteUrl)
    const csrftoken = getCookie('csrftoken');
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    })

    if (result.isConfirmed) {
        try {
            const response = await fetch(deleteUrl, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
            });
            const result = await response.json();
            console.log(result);

            if (result.success === true) {
                Swal.fire({
                    title: result.message,
                    icon: "success",
                    timer: 3000
                })
                const search = $("#search").val();
                const url = `?search=${search}`;
                loadPage(url);
            } else {
                console.log("Something went wrong.", err);
            }
        } catch (err) {
            console.log("Something went wrong.", err);
        }
    }
};


