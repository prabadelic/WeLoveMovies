const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function reviewExists(req, res, next) {
  reviewsService
    .read(req.params.reviewId)
    .then((review) => {
      if (review) {
        res.locals.review = review;
        return next();
      }
      next({ status: 404, message: `Review cannot be found.` });
    })

    .catch(next);
}

function destroy(req, res, next) {
  reviewsService
    .delete(res.locals.review.review_id)
    .then(() => res.sendStatus(204))
    .catch(next);
}

async function update(req, res, next) {
  const updatedReview = {
    ...res.locals.review,
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };

  await reviewsService.update(updatedReview);

  const newReview = await reviewsService.getReviews(updatedReview.review_id);

  res.json({ data: newReview[0] });
}

module.exports = {
  delete: [reviewExists, destroy],
  update: [reviewExists, asyncErrorBoundary(update)],
};
