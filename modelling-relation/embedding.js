const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Courses",
  new mongoose.Schema({
    name: String,
    authors: [authorSchema],
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });


  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(id) {
  const course = await Course.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        // author: { name: "Chau" }, or do this
        "author.name": "print result",
      },
      // or use unset to unset nested property
      // $unset :{
      //   "author": ''
      // }
    }
  );
}

async function addAuthor(id){
  const course = await Course.findById(id);
  course.authors.push({name : 'Macor'}, {name:'Andre'})
  course.save()
  console.log(course)
}

async function removeAuthor(id,authorId){
  const course = await Course.findById(id);
  const author = course.authors.id(authorId);
  author.remove();
  course.save()
  console.log(course)
}

removeAuthor('5ead14c7a0776735a977c36e','5ead14c7a0776735a977c36c')

//addAuthor('5ead14c7a0776735a977c36e')

//updateAuthor("5ead01329af6f92efac4da46", "Chau Pham");
