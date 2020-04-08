const express = require('express');
const Joi = require('joi')
const app = express();
const port = process.env.PORT || 5000;
app.use(express.json())
const genres = {
    id : 1, name : 'jocker',
    id : 2, name : 'before me',
    id : 3, name : 'batman'
}
 console.log(genres)

app.get('/vidly.com', (req, res) => res.send('welcome to Vidly, have a nice time!'));
app.get('/vidly.com/api/genres', (req, res) => res.send(genres));


app.listen(port,()=> console.log(`app is listening to ${port} `))