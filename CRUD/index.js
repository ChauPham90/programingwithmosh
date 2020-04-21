const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playaround')
    .then(()=> console.log('connecting to mongoDB'))
    .catch((err)=> console.error('can not connect...',err));

const courseSchema = new mongoose.Schema({
    name : String,
    author: String,
    tags : [String],
    date : { type : Date, default : Date.now},
    isPublic : Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function createData(){
// create a new data
const course = new Course({
    name : ' React JS',
    author : 'Mosh',
    tags :[ 'React', 'front-end'],
    isPublic: true
});
//save it
const result = await course.save();
//console.log(result)
}

async function findCourse(){
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
    const courses = await Course
//  .find({author: 'Mosh',isPublic: 'true'})
//  .find({price : { $gte: 10, $lte: 20} } )
//  .find({price : { $in : [ 10, 15, 20]}})
    .find()
    .or([ {author :'Mosh'}, {isPublic:'true'} ])
    .and([ {author: 'Mosh',isPublic: 'true'}])
//start with Mosh
    .find({ author : /^Mosh/})
//end with Mosh, case insensitive
    .find({author: /Mosh$/i})
// contain Mosh
    .find({author: /.*Mosh.*/i})
    .sort({name:1})
    .skip((pageNumber -1)*pageSize)
    .limit(pageSize)
    .select({name: 1, tags:1})
    .count()
    console.log(courses);
  
}
findCourse()
