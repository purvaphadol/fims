
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
               getAjaxData();
            } else {
                console.log("Something went wrong.", err);
            }
        } catch (err) {
            console.log("Something went wrong.", err);
        }
    }
};




