const express = require("express");
const fs = require("fs/promises");
const app = express();
const path = require("path");
const dataPath = "./data/";

app.use(express.urlencoded({ extended: true }));
app.get("/", async function(req, res) {
    const foundPeople = await peopleDir();
    res.send(
        `Archivos Disponibles : ${foundPeople} 
        <br> 
        <a href="/files">Ver Archivos</a>
        <br>
        <a href="/create">Crear Archivo</a>`
    );
});

app.get("/create", async function(req, res) {
    res.sendFile(__dirname + "/create.html");
});

app.post("/create", async function(req, res) {
    let template = {
        nombre: "Placeholder",
        apellido : "Placeholder",
        numero : "Placeholder",
        pais : "Placeholder"
    }
    try {
        template.nombre = req.body.nombre;
        template.apellido = req.body.apellido;
        template.numero = req.body.numero;
        template.pais = req.body.pais;
        await fs.writeFile(dataPath + `${template.nombre.toLowerCase()}.json`, JSON.stringify(template, null, 2));
        res.redirect('/');
    } catch (error) {
        res.send(
            `HA OCURRIDO UN ERROR AL GUARDAR :${error}`
        );
    }
});

app.get("/files", async function(req, res) {
    const foundPeople = await peopleDir();
    let refs = ``;
    for (people of foundPeople) {
        console.log(people);
        refs += `
        <br> 
        <a href="/files/${people}">${people}</a>
        `
    }
    refs += `
    <br> <br> 
    <a href="/">Volver</a>
    `;
    res.send(refs);
});

app.get("/files/:name", async function(req, res) {
    const people = req.params.name;
    const file = await fs.readFile(`${dataPath + people}.json`, "utf-8");
    const json = JSON.parse(file);
    res.send(
        `
        Informacion del archivo "${people}.json"
        <br> 
        Nombre: ${json.nombre}
        <br> 
        Apellido: ${json.apellido}
        <br> 
        Numero Telefonico : ${json.numero}
        <br> 
        Pais : ${json.pais}
        <br> <br> 
        <a href="/">Volver</a>
        `);
});

app.listen(3000, function() {
    console.log(`App en puerto 3000`)
});

async function peopleDir() {
    const people = [];
    try {
        const files = await fs.readdir(dataPath);
        for (let file of files) {
            if(file.endsWith(".json"))
                file = file.split(".json")[0];
            people.push(file);
        }
    } catch (err) {
        console.error(err);
    } 
    return people;
}