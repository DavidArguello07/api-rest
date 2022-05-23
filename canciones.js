var express = require('express');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var router = express.Router();
var path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://D_Arguello:Jesus2021@cluster0.gimis.mongodb.net/db1?retryWrites=true&w=majority"
  )
  .catch((error) => handleError(error));

//Definiendo el esquema
const personaSchema = new mongoose.Schema(
  {
    // _id: mongoose.Schema.Types.ObjectId,
    cancion: String,
    artista: String,
    album: String,
    anio: Number,
    pais: String,
  },
  {
    collection: "canciones", //para forzar a enlazar con una colección
  }
);

// paseando el esquema al modelo
const Persona = mongoose.model("Persona", personaSchema);

  router.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,'html','canci.html'))
  })

  //Consultar todas las canciones SIUUUUUUUUUUUUUU
  router.get("/canciones", (req, res) => {
    Persona.find((err, cancis) => {
      if (err) res.status(500).send("Error en la base de datos  #1");
      else res.status(200).json(cancis);
    });
  });

     //Consulta de canciones que sean del año X o más reciente
     router.get("/canciones/reciente", function (req, res) {
      //hace un query de los documentos
      Persona.find({ anio: { $gte: req.query.anio } }, function (err, cancis) {
        if (err) {
          console.log(err);
          res.status(500).send("Error al leer de la base de datos");
        } else res.status(200).json(cancis);
      });
    });

  //Consulta de canciones por nombre de artista SIUUUUUUUUUU
  router.get("/canciones/porNombre", function (req, res) {
    //hace un query de los documentos
    Persona.find({  artista: req.query.artista  }, function (err, cancis) {
      if (err) {
        console.log(err);
        res.status(500).send("Error al leer de la base de datos #3");
      } else res.status(200).json(cancis);
    });
  });

     //Consulta de canciones que estén entre dos años (desde – hasta) SIUUUUUUUUUUUU  
     router.get("/canciones/dentro", function (req, res) {
      //hace un query de los documentos
      Persona.find({ anio: { $gte: req.query.anio ,  $lte: req.query.anio1}}, function (err, cancis) {
        if (err) {
          console.log(err);
          res.status(500).send("Error al leer de la base de datos");
        } else res.status(200).json(cancis);
      });
    });
  
    //Crear una nueva canción en la base de datos SIUUUUUUUUUUUUU
  router.post("/canciones", function (req, res) {
    //crea un objeto pero del modelo Persona
    const cancion1 = new Persona({
      cancion: req.body.cancion,
      artista: req.body.artista,
      album: req.body.album,
      anio: req.body.anio,
      pais: req.body.pais
    });
  
    //guarda una persona en la base de datos
    cancion1.save(function (error, canci) {
      if (error) {
        res.status(500).send("No se ha podido agregar.");
      } else {
        res.status(200).json(canci); //envía al cliente el id generado
      }
    });
  });

  //Modificar la información de una canción por su ID SIUUUUUUUUUUUUUUUUU
  router.put("/canciones/:id", function (req, res) {
    //Modificar con Find ID
    Persona.findById(req.params.id, function (err, cancis) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (cancis != null) {
          cancis.cancion = req.body.cancion;
          cancis.artista = req.body.artista;
          cancis.album = req.body.album;
          cancis.anio = req.body.anio;
          cancis.pais = req.body.pais;
  
          cancis.save(function (error, cancion1) {
            if (error) res.status(500).send("Error en la base de datos");
            else {
              res.status(200).send("Modificado exitosamente");
            }
          });
        } else res.status(404).send("No se encontro esa cancion");
      }
    });

  });
  
  //Eliminar una canción por su ID (o deshabilitarla para que ya no aparezca en los resultados) SIUUUUUUUUUUUUUUUU
  router.delete("/canciones/:id", function (req, res) {
    //Eliminar con Find ID
    Persona.findById(req.params.id, function (err, canci) {
      if (err) res.status(500).send("Error en la base de datos");
      else {
        if (canci != null) {
          canci.remove(function (error, result) {
            if (error) res.status(500).send("Error en la base de datos");
            else {
              res.status(200).send("Eliminado exitosamente");
            }
          });
        } else res.status(404).send("No se encontro esa cancion en la lista");
      }
    });

  });

    //Consultar una canción por ID SIUUUUUUUUUUUUUUUUUUU
    router.get("/canciones/porid/:id", function (req, res) {
      //busca un registro por id
      Persona.findById(req.params.id, function (err, canci) {
        if (err) res.status(500).send("Error en la base de datos #22");
        else {
          if (canci != null) {
            res.status(200).json(canci);
          } else res.status(404).send("No se encontro esa cancion");
        }
      });
    });
  
  
module.exports = router;