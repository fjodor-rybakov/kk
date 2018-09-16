$("#submit-button").on("click", function (event) {
    event.preventDefault();
    let form = new FormData();
    form.append("url", $("#data-url").val());
    $.ajax({
        type: 'POST',
        url: '/get_data_urls',
        data: form,
        cache: false,
        contentType: false,
        processData: false,
        success: successGetDataUrls,
        reject: rejectGetDataUrls
    });
});

function successGetDataUrls(data) {
    console.log(data);
}

function rejectGetDataUrls(error) {
    console.log(error);
}