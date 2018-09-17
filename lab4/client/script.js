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
        error: rejectGetDataUrls
    });
});

function successGetDataUrls(data) {
    const parseData = JSON.parse(data);
    $("#access-urls").html("");
    $("#error").html("");
    parseData.map((item) => {
        $("#access-urls").append('<a href="' + item.url + '">' + item.url + '</a>');
    });
}

function rejectGetDataUrls(error) {
    $("#access-urls").html("");
    $("#error").append('<h3>' + error.responseJSON.message + '</h3>');
}