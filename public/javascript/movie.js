$(document).ready(function () {
    $(".delete-review-button").click(deleteReview);
    $("#review-form").submit(createReview);
})

function createReview(event) {
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: $(this).attr("action"),
        data: $(this).serialize(),
    })
        .done(function (review) {
            $('#review-container').prepend(
                `
                <div id="review-${review._id}" class="card bg-dark my-2">
                    <div class="card-body">
                        <div class="d-flex flex-row justify-content-between">
                            <div class="d-flex flex-column">
                                <div class="d-flex flex-row align-items-center">
                                <h4 class="card-title">${review.title}&ensp;</h4>
                                <h6 class="card-subtitle text-muted">${new Date(review.createdAt).toDateString()}</h6>
                                </div>
                                <div>
                                    <h6 class="card-subtitle mb-2 text-muted">${review.userId.name}</h6>
                                </div>
                            </div>
                            <div class="d-flex flex-column">
                                <h4 class="d-flex flex-row justify-content-end">${review.rating} / 5</h4>
                                <a class="delete-review-button" href="/review/${review._id}"><button class="btn btn-light">Delete</button></a>
                            </div>
                        </div>
                        <p class="card-text">${review.description}</p>
                    </div>
                </div>
                `
            );
            $(`#review-${review._id}`).find(".delete-review-button").click(deleteReview);
            $("input, textarea").not("[type=hidden]").not("[readonly]").val("");
            $("select").val(5);
            $(".modal").modal("hide");
        })
        .fail(function (error) {
            alert('There was a problem saving your review. Please try again.')
            console.error(error);
        })
}

function deleteReview(event) {
    event.preventDefault();
    if(!confirm('Are you sure you want to delete review?'))
        return;
    // var reviewId = $(this).attr("action").match(/\/reviews\/(\w*)/)[1];

    $.ajax({
        type: "DELETE",
        url: $(this).prop('href')
    })
        .done(function (reviewId) {
            $(`#review-${reviewId}`).remove()
        })
        .fail(console.error)
}
