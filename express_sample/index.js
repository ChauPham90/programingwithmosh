const Joi = require("joi");
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
const courses = [
  { id: 1, name: "course 1" },
  { id: 2, name: "course 2" },
  { id: 3, name: "course 3" },
];

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/api/courses", (req, res) => res.send(courses));

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) return res.status(404).send("the course with given id is not found.");
  res.send(course);
});
//app.get('/api/course/:years/:month',(req, res) => res.send(req.params) )
app.get("/api/course/:years/:month", (req, res) => res.send(req.query));

app.post("/api/courses", (req, res) => {
  const {error} = validateCourse(req.body)
  if (error)  return res.status("400").send(error.details[0].message);
    
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
	// look up the course
	//if not exist, return 404
	const course = courses.find((c) => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send("the course with given id is not found.");
	//validate
	// if invalid, return 400 - bad request
	const {error} = validateCourse(req.body)
	if (error) 	return res.status("400").send(error.details[0].message);
	//update course
	//return updated courses
	course.name = req.body.name
	res.send(course)
})

const validateCourse =(course) => {
	const schema = {
		name: Joi.string().min(3).required(),
	  };
	  return Joi.validate(course, schema);
}

app.delete("/api/courses/:id",(req,res) => {
	// look up the course, if not exist, return 404
	const course = courses.find((c) => c.id === parseInt(req.params.id));
	if (!course) return res.status(404).send("the course with given id is not found.");
	//find index
	const index = courses.indexOf(course);
	courses.splice(index,1);
	res.send(course)
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
