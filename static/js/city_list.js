$(document).ready(function () {
    function loadPage(url) {
        $.ajax({
            url: url,
            type: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            success: function (data) {
                $('#ajax-table').html(data.city_html);
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", error);
            }
        });
    }

    $(document).on('click', '.pagination a.page-link', function (e) {
        e.preventDefault();
        const url = $(this).attr('href');
        loadPage(url);
    });

    $("#search-form").on('submit', function (e) {
        e.preventDefault();
        const search = $("#search").val();
        const url = `?search=${search}&page=1`;
        loadPage(url);
    });

    $("#search-form").on('keyup', function (e) {
        e.preventDefault();
        const search = $("#search").val();
        const exurl = `/city_excel/`;
        const url = `?search=${search}`;
        const newURL = exurl + url;
        $("#excelURL").attr('href', newURL);

        if (search === "") {
            const url = $(this).attr('href');
            loadPage(url);
        }
    });
});

