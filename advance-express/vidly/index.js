const Joi = require("joi");
const express = require("express");
const app = express();
//const movies = require("./routes/movies");
const rental = require("./routes/rental");
//const genres = require("./routes/genres");
//const customers = require("./routes/customers");

app.use(express.json());
//app.use("/api/genres", genres);
//app.use("/api/customers", customers);
//app.use("/api/movies", movies);
app.use("/api/rental", rental);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
