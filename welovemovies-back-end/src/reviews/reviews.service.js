const knex = require("../db/connection");

function read(reviewId) {
  return knex("reviews").select("*").where({ review_id: reviewId }).first();
}

function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

function update(updatedReview) {
  return knex("reviews")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*");
}

function getReviews(reviewId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at",
      "r.updated_at",
      "r.critic_id",
      "r.movie_id",
      "c.critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
      "c.created_at as critic_created_at",
      "c.updated_at as critic_updated_at"
    )
    .where({ "r.review_id": reviewId })
    .then((reviews) => {
      return reviews.map((review) => {
        return {
          review_id: review.review_id,
          content: review.content,
          score: review.score,
          created_at: review.created_at,
          updated_at: review.updated_at,
          critic_id: review.critic_id,
          movie_id: review.movie_id,
          critic: {
            critic_id: review.critic_id,
            preferred_name: review.preferred_name,
            surname: review.surname,
            organization_name: review.organization_name,
            created_at: review.critic_created_at,
            updated_at: review.critic_updated_at,
          },
        };
      });
    });
}

module.exports = {
  read,
  delete: destroy,
  update,
  getReviews,
};