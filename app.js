const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

const pathFile = path.resolve('./resources/starwar.json');
let personajes = [];

fs.readFile(pathFile, { encoding: 'utf8' }, (err, data) => {
    if (!err) {
        personajes = JSON.parse(data);

        personajes = personajes.map((p, index) => ({
            ...p,
            _id: p._id || (index + 1).toString()
        }));
    } else {
        console.error('Error leyendo el archivo:', err);
    }
});


app.get('/', (req, res) => {
    res.render('index', { personajes });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.get('/buscar', (req, res) => {
    let { nombre, id, planeta, especie } = req.query;

    nombre = nombre ? nombre.trim() : null;
    id = id ? id.trim() : null;
    planeta = planeta ? planeta.trim() : null;
    especie = especie ? especie.trim() : null;

    let resultados = personajes;

    if (nombre) {
        resultados = resultados.filter(p => p.name.toLowerCase().includes(nombre.toLowerCase()));
    }

    if (id) {
        resultados = resultados.filter(p => p._id === id);
    }

    if (planeta) {
        resultados = resultados.filter(p => p.homeworld === planeta);
    }

    if (especie) {
        resultados = resultados.filter(p => p.species === especie);
    }

    res.render('index', { personajes: resultados });
});


