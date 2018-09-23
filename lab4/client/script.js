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


function resetContent() {
    $("#accept-urls").html("");
    $("#reject-urls").html("");
    $("#error").html("");
}

function successGetDataUrls(data) {
    const parseData = JSON.parse(data);
    resetContent();
    parseData.acceptLinks.map((item) => {
        $("#accept-urls").append('<div>' +
                '<a href="' + item.url + '">' + item.url + '</a>' +
                '<p>' + item.status + '</p>' +
            '</div>');
    });
    parseData.rejectLinks.map((item) => {
        $("#reject-urls").append('<div>' +
            '<a href="' + item.url + '">' + item.url + '</a>' +
            '<p>' + item.status + '</p>' +
            '</div>');
    });
}

function rejectGetDataUrls(error) {
    resetContent();
    $("#error").append('<h3>' + error.responseJSON.message + '</h3>');
}