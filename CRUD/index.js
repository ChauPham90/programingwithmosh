const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/playaround")
  .then(() => console.log("connecting to mongoDB"))
  .catch((err) => console.error("can not connect...", err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    //match: /pattern/
  },
  category: {
    type: String,
    enum: ["web", "mobile", "network"],
    required: true,
    //uppercase: true,
    lowercase: true,
    trim: true,
  },
  author: String,
  //custom validation
  tags: {
    type: Array,
    // validate: {
    //   validator: function (value) {
    //     return value && value.length > 0;
    //   },
    //   message: " course should have one tag at least",
    // },

    //do async validtation
    validate: {
      isAsync: true,
      validator: function (value, cb) {
        setTimeout(() => {
          const result = value && value.length > 0;
          cb(result);
        }, 2000);
      },
      message: " course should have one tag at least",
    },
  },
  date: { type: Date, default: Date.now },
  isPublic: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublic;
    },
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model("Course", courseSchema);

async function createData() {
  // create a new data
  const course = new Course({
    name: " React JS",
    author: "Mosh",
    tags: ["React", "front-end"],
    price: 15.5,
    category: "web",
    isPublic: true,
  });
  //save it
  try {
    const result = await course.save();
    console.log(result);
    // const isValid = await course.validate();
    // if(!isValid){
    //     //some logic here
    // }
    //console.log(result);
  } catch (ex) {
    //console.log(ex.message);
    for (feild in ex.errors) {
      console.log(ex.errors[feild].message);
    }
  }
}
//createData();

async function findCourse() {
  //eq: equal
  //ne : not equal
  //gt : greater than
  //gte : greater then or equal
  //lt: less than
  //lte: less than or equal
  //in
  //nin: not in

  //or
  //and
  const pageNumber = 2;
  const pageSize = 10;
  const courses = await Course.find({
    _id: "5ea0040f66a31908bc05f095",
    isPublic: "true",
  })
    //  .find({price : { $gte: 10, $lte: 20} } )
    //  .find({price : { $in : [ 10, 15, 20]}})
    // .find()
    //.or([{ author: "Mosh" }, { isPublic: "true" }])
    //.and([{ author: "Mosh", isPublic: "true" }])
    //start with Mosh
    //.find({ author: /^Mosh/ })
    //end with Mosh, case insensitive
    // .find({ author: /Mosh$/i })
    // contain Mosh
    // .find({ author: /.*Mosh.*/i })
    //.sort({ name: 1 })
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)
    .select({ name: 1, tags: 1, price: 1 });
  //.count();
  console.log(courses[0].price);
}
findCourse();
//updating a document -query first
async function updateCourse(id) {
  const course = await Course.findById(id);
  if (!course) return;
  course.isPublic = true;
  course.author = "another author";
  console.log(course);
}
//updateCourse('5e9ebb016996873a703683a5')

//updating a document - update first
async function updateMethod(id) {
  const result = await Course.update({ _id: id }, { $set: { author: "Mosh" } });
  console.log(result);
}
//updateMethod('5e9ebb016996873a703683a5');

async function updateAndPrintResult(id) {
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: { author: "Jack", isPublic: false },
    },
    { new: true }
  );
  console.log(course);
}
//updateAndPrintResult('5e9ebb016996873a703683a5')

//remove a document
async function removeCourse(id) {
  const result = await Course.remove({ _id: id });
  console.log(result);
}
//removeCourse('5e9ebb016996873a703683a5')

async function removeManyCourses(id) {
  //  const result = await Course.deleteMany({_id:id})
  //  console.log(result)

  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}
//removeManyCourses('5e9eb9eca5f5173a2a834e91')
