const fs = require('fs');
const csv = require('csv-parser');

const db = {};

fs.createReadStream('datos.csv')
    .pipe(csv())
    .on('data', (row) => {
        const [departamento, categoria, tallas, generos] = Object.values(row);
        const tallasArray = tallas.split(',');
        const generosArray = generos ? generos.split(',') : null;

        if (!db[departamento]) {
            db[departamento] = {};
        }

        if (!db[departamento][categoria]) {
            db[departamento][categoria] = {
                tallas: [],
                genero: []
            };
        }

        db[departamento][categoria].tallas = db[departamento][categoria].tallas.concat(tallasArray);

        if (generosArray) {
            db[departamento][categoria].genero = db[departamento][categoria].genero.concat(generosArray);
        }
    })
    .on('end', () => {
        fs.writeFile('salida.json', JSON.stringify(db, null, 2), (err) => {
            if (err) throw err;
            console.log('Archivo de salida generado exitosamente');
        });
    });