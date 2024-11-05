const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const isShowing = req.query.is_showing;
  //console.log(isShowing);
  if (isShowing === `true`) {
    const data = await moviesService.getMoviesShowing();
    res.json({ data });
  } else {
    const data = await moviesService.list();
    res.json({ data });
  }
}

async function getTheatresForMovie(req, res) {
  const { movieId } = req.params;
  const data = await moviesService.getTheatresForMovie(movieId);
  res.json({ data });
}

async function getReviewsForMovie(req, res) {
  const { movieId } = req.params;
  const data = await moviesService.getReviewsForMovie(movieId);
  res.json({ data });
}

function movieExists(req, res, next) {
  moviesService
    .read(req.params.movieId)
    .then((movie) => {
      if (movie) {
        res.locals.movie = movie;
        return next();
      }
      next({ status: 404, message: `Movie cannot be found.` });
    })
    .catch(next);
}

function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data });
}

module.exports = {
  read: [movieExists, read],
  list: asyncErrorBoundary(list),
  getTheatresForMovie: asyncErrorBoundary(getTheatresForMovie),
  getReviewsForMovie: asyncErrorBoundary(getReviewsForMovie),
};
