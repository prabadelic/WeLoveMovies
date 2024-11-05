const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}

function getMoviesShowing() {
  return knex("movies_theaters as mt")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where("mt.is_showing", true)
    .distinct("m.movie_id");
}

function getTheatresForMovie(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "mt.theater_id", "t.theater_id")
    .select(
      "t.theater_id",
      "t.name",
      "t.address_line_1",
      "t.address_line_2",
      "t.city",
      "t.state",
      "t.zip",
      "t.created_at",
      "t.updated_at",
      "mt.is_showing",
      "mt.movie_id"
    )
    .where({ "mt.movie_id": movieId });
}

function getReviewsForMovie(movieId) {
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
    .where({ "r.movie_id": movieId })
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

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

module.exports = {
  read,
  list,
  getMoviesShowing,
  getTheatresForMovie,
  getReviewsForMovie,
};
