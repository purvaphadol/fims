const deleteBtn = document.querySelectorAll("#deleteBtn");
console.log(deleteBtn)
deleteBtn.forEach(btn => {
    btn.addEventListener("click", function() {
    const deleteUrl = this.getAttribute("data-url");
    Swal.fire({
        title: "Are you sure?",
        text: " Cities within state will also get deleted.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = deleteUrl;
        }
    })
});
});

