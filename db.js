const Sequelize = require('sequelize');
const { DataTypes: { STRING, UUID, UUIDV4 } } = Sequelize;

const conn = new Sequelize(process.env.DATABASE_URL ||'postgres://localhost/imdb_db');

//Create models
const Movie = conn.define('movie', {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4
  },
  title: {
    type: STRING(50),
    allowNull: false,
    unique: true
  }
});

const Detail = conn.define('movie_detail', {
  releaseyear: {
    type: STRING(4)
  },
  description: {
    type: STRING(250)
  },
  rating: {
    type: STRING(3)
  }
});

//Create associations
Detail.belongsTo(Movie);

//Sync and seed data
const syncAndSeed = async() => {
  await conn.sync({ force: true });

  const [movie1, movie2, movie3, movie4, movie5] = await Promise.all([
    await Movie.create({ title: 'The Shawshank Redemption'}),
    await Movie.create({ title: 'The Godfather'}),
    await Movie.create({ title: 'The Dark Knight'}),
    await Movie.create({ title: 'The Godfather: Part II'}),
    await Movie.create({ title: '12 Angry Men'})
  ]);

  const [detail1, detail2, detail3, detail4, detail5] = await Promise.all([
    await Detail.create({
      releaseyear: '1994',
      description:
        'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      rating: '9.3',
      movieId: movie1.id
    }),
    await Detail.create({
      releaseyear: '1972',
      description:
        'An organized crime dynasty\'s aging patriarch transfers control of his clandestine empire to his reluctant son.',
      rating: '9.2',
      movieId: movie2.id
    }),
    await Detail.create({
      releaseyear: '2008',
      description:
        'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      rating: '9.0',
      movieId: movie3.id
    }),
    await Detail.create({
      releaseyear: '1974',
      description:
        'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',
      rating: '9.0',
      movieId: movie4.id
    }),
    await Detail.create({
      releaseyear: '1957',
      description:
        'A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.',
      rating: '9.0',
      movieId: movie5.id
    })
  ])
};

//Export modules
module.exports = {
  syncAndSeed,
  models: {
    Movie,
    Detail
  }
};
