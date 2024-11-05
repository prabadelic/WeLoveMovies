const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const reduceTheaterAndMovies = reduceProperties("theater_id", {
  theater_id: ["theater_id"],
  name: ["name"],
  address_line_1: ["address_line_1"],
  address_line_2: ["address_line_2"],
  city: ["city"],
  state: ["state"],
  zip: ["zip"],
  movie_id: ["movies", null, "movie_id"],
  title: ["movies", null, "title"],
  runtime_in_minutes: ["movies", null, "runtime_in_minutes"],
  rating: ["movies", null, "rating"],
  description: ["movies", null, "description"],
  image_url: ["movies", null, "image_url"],
});

function list() {
  return knex("theaters as t")
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .join("movies as m", "mt.movie_id", "m.movie_id")
    .select(
      "t.theater_id",
      "t.name",
      "t.address_line_1",
      "t.address_line_2",
      "t.city",
      "t.state",
      "t.zip",
      "m.movie_id",
      "m.title",
      "m.runtime_in_minutes",
      "m.rating",
      "m.description",
      "m.image_url"
    )
    .where("mt.is_showing", true)
    .then(reduceTheaterAndMovies);
}

module.exports = {
  list,
};

function getMoviesShowing() {
  return knex("movies_theaters as mt")
    .join("movies as m", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where("mt.is_showing", true)
    .distinct("m.movie_id");
}


module.exports = {
  list,
};