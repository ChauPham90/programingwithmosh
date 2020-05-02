const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const Author = mongoose.model(
  "authors",
  new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
  })
);

const Course = mongoose.model(
  "courses",
  new mongoose.Schema({
    name: String,
    author: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "authors",
      required: true,
    },
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find()
    .populate('author','name -_id')
    .select("name author")
    
  console.log(courses);
}

//createAuthor('Mosh', 'My bio', 'My Website');

//('Node Course', '5eacbc09b2dddd249d91d718')

listCourses();
