const express = require('express');

const app = express();
app.use(express.json());

const pool = require('./config/baseDatos');

const rutasRecetas = require('./rutas/recetas.rutas');
const rutasIngredientes = require('./rutas/ingredientes.rutas');

app.use('/recetas', rutasRecetas);
app.use('/ingredientes', rutasIngredientes)

app.listen(3000, () => {
    console.log('Servidor funcionando en el puerto 3000');
});

pool.query('SELECT NOW()')
    .then(resultado => {
        console.log('Conexión con PostgreSQL exitosa');
        console.log(resultado.rows[0]);
    })
    .catch(error => {
        console.error('Error al conectar con PostgreSQL:', error.message);
    });