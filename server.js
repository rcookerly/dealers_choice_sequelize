const express = require('express');
const db = require('./db');

const { syncAndSeed, models: { Movie, Detail } } = db;
const PORT = process.env.PORT || 3000;
const app = express();

//Initial route
app.get('/', async(req, res, next) => {
  try {
    const movieData = await Movie.findAll();
    const detailData = await Detail.findAll();
    const movieTitles = movieData.map(movie => movie.dataValues.title);
    const html =
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Dealer's Choice - PG</title>
      </head>
      <body>
        <h1>IMDb "Top 5"</h1>
        <ol type="1">
          ${detailData.map(movie =>
            `<li>
              <a href="/movies/${movie.id}">${movieTitles[movie.id - 1]}</a>
              (${movie.releaseyear}) - IMDb Rating: ${movie.rating}
            </li>`
          ).join('')}
        </ol>
      </body>
      </html>`;

    res.send(html);
  }
  catch(ex) {
    console.log(ex);
    next(ex);
  }
});

//Single-movie route
app.get('/movies/:id', async(req, res, next) => {
  try {
    const movieData = await Movie.findAll();
    const detailData = await Detail.findAll();
    const movieTitles = movieData.map(movie => movie.dataValues.title);
    const movieDescriptions = detailData.map(movie => movie.dataValues.description);
    const html =
      `<!DOCTYPE html>
      <html>
      <head>
        <title>Dealer's Choice - PG</title>
      </head>
      <body>
        <div>
          <a href="/">Back To List</a>
        </div>
        <ul>
          ${movieTitles[req.params.id - 1]} - ${movieDescriptions[req.params.id - 1]}
        </ul>
      </body>
      </html>`;

    res.send(html);
  }
  catch(ex) {
    console.log(ex);
    next(ex);
  }
});

const start = async() => {
  try {
    await syncAndSeed();
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}`);
    });
  }
  catch(ex) {
    console.log(ex);
    next(ex);
  }
};

start();
