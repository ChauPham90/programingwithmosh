const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const Genres = mongoose.model(
  "genre",
  new mongoose.Schema({
    name: String,
  })
);
const Movie = mongoose.model(
  "movie",
  new mongoose.Schema({
    title: String,
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "genre",
    },
    numberInStock: Number,
    dailyRentalRate: Number,
  })
);

async function createGenres(name) {
  const genre = new Genres({ name });
 const result = await genre.save();
  console.log(result);
}

async function createMovies(title, genre, numberInStock, dailyRentalRate) {
  const movies = new Movie({
    title,
    genre,
    numberInStock,
    dailyRentalRate,
  });
  const result = await movies.save()
  console.log(result);
}

async function listMovie(){
    const movie = await Movie.find().select('name title').populate('genre','name-_id');
    console.log(movie)
}
listMovie()

//createGenres('horror')
//createMovies('phim ma','5ead3d0767915e3abea92b91',5, 4.5)