const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
//const movies = require("./routes/movies");
//const rental = require("./routes/rental");
//const genres = require("./routes/genres");
//const customers = require("./routes/customers");
const user = require("./routes/users");

app.use(express.json());
//app.use("/api/genres", genres);
//app.use("/api/customers", customers);
//app.use("/api/movies", movies);
//app.use("/api/rental", rental);
app.use("/api/users", user);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));