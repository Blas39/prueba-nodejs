import { Router } from "express";
import Persona from "../models/Persona.js";
import path from "path";

const router = Router();

/*const fs = require("fs/promises");
const dataPath = "./data/";

async function peopleDir() {
  const people = [];
  try {
    const files = await fs.readdir(dataPath);
    for (let file of files) {
      if (file.endsWith(".json")) file = file.split(".json")[0];
      people.push(file);
    }
  } catch (err) {
    console.error(err);
  }
  return people;
}*/

router.get("/", async function (__, res) {
  const foundPeople = await Persona.find({});
  res.send(`
    <div style="position: relative; height: 100vh; font-family: sans-serif; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">

      <div style="padding: 2rem; background-color: white; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.1); z-index: 0;">
        <h2>📁 Archivos disponibles: ${foundPeople.length}</h2>
        <ul style="list-style: none; padding: 0;">
          <li><a href="/files">Ver Archivos</a></li>
          <li><a href="/create">Crear Archivo</a></li>
        </ul>
      </div>

    </div>
  `);
});

router.get("/create", function (req, res) {
  res.render("create.hbs");
});

router.post("/create", async function (req, res) {
  try {
    await Persona.create({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      numero: req.body.numero,
      pais: req.body.pais,
    });
    res.redirect("/");
  } catch (error) {
    res.send(`HA OCURRIDO UN ERROR AL GUARDAR: ${error}`);
  }
});

router.get("/files", async function (__, res) {
  const personas = await Persona.find({});
  let refs = `<div style="position: relative; height: 100vh; font-family: sans-serif; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
     <div style="padding: 2rem; background-color: white; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.1); z-index: 0;">`;
  for (const persona of personas) {
    refs += `<br><a href="/files/${persona._id}">${persona.nombre}</a>`;
  }
  refs += `<br><br><a href="/">Volver</a>
  </div>
    </div>`;
  res.send(refs);
});

router.get("/files/:id", async function (req, res) {
  const persona = await Persona.findById(req.params.id);
  if (!persona) return res.send("No se encontró el registro");

  res.send(`
    <div style="position: relative; height: 100vh; font-family: sans-serif; text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center;">
     <div style="padding: 2rem; background-color: white; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.1); z-index: 0;">
      Información:
      <br>Nombre: ${persona.nombre}
      <br>Apellido: ${persona.apellido}
      <br>Teléfono: ${persona.numero}
      <br>País: ${persona.pais}
      <br><br><a href="/files/${persona._id}/edit">Editar</a>
      <br><br><a href="/files/${persona._id}/delete">Eliminar</a>
      <br><br><a href="/files">Volver</a>
      </div>
    </div>
  `);
});

router.get("/files/:id/delete", async function (req, res) {
  await Persona.findByIdAndDelete(req.params.id);
  res.redirect("/files");
});

router.get("/files/:id/edit", async function (req, res) {
  const persona = await Persona.findById(req.params.id);
  if (!persona) return res.send("No se encontró el registro");

  const personaData = persona.toObject();

  res.render("edit.hbs", { persona: personaData });
});

router.post("/files/:id/edit", async function (req, res) {
  try {
    const persona = await Persona.findById(req.params.id);
    if (!persona) return res.send("No se encontró el registro");

    persona.nombre = req.body.nombre;
    persona.apellido = req.body.apellido;
    persona.numero = req.body.numero;
    persona.pais = req.body.pais;

    await persona.save();

    res.redirect(`/files/${persona._id}`);
  } catch (error) {
    res.send(`HA OCURRIDO UN ERROR AL ACTUALIZAR: ${error}`);
  }
});

export default router;
