$(document).ready(function () {
    $(document).on('click', '.pagination a.page-link', function (e) {
        e.preventDefault();
        const url = $(this).attr('href');
        $.ajax({
            url: url,
            type: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            success: function (data) {
                $('#ajax-table').html(data.family_html);
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", error);
            }
        });
    });

    $("#search-form").on('submit', function (e) {
        e.preventDefault();
        getAjaxData();
    });

    $("#search-form").on('keyup', function (e) {
        e.preventDefault();
        const search = $("#search").val();
        const exurl = `/head_excel/`;
        const url = `?search=${search}`;
        const newURL = exurl + url;
        $("#excelURL").attr('href', newURL);

        if (search === "") {
            const url = $(this).attr('href');
            $.ajax({
                url: url,
                type: 'GET',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                success: function (data) {
                    $('#ajax-table').html(data.family_html);
                },
                error: function (xhr, status, error) {
                    console.error("AJAX Error:", error);
                }
            });
        }
    });
});

function getAjaxData() {
    const search = $("#search").val();
        const url = `?search=${search}`;
        $.ajax({
            url: url,
            type: 'GET',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            success: function (data) {
                $('#ajax-table').html(data.family_html);
            },
            error: function (xhr, status, error) {
                console.error("AJAX Error:", error);
            }
        });
}

