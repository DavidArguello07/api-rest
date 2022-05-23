//npm install
const express = require("express");
var cancion = require ("./canciones");
const bodyParser = require("body-parser");
var path = require("path");
const app = express();

app.listen(3000, () => console.log("App escuchando en el puerto 3000!"));

//El bodyparser no estoy seguro si debe de ir en este o en el otro archivo por lo que lo dejé en ambos
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api", cancion);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'html','inicio.html'));
});

app.use(function(req, res, next) {
  res.status(404).send('Esta página no existe!');
});
