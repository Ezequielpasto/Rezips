const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const pool = require('./config/baseDatos');

const rutasRecetas = require('./rutas/recetas.rutas');
const rutasIngredientes = require('./rutas/ingredientes.rutas');
const rutasPasos = require('./rutas/pasos.rutas');
const rutasCategorias = require('./rutas/categorias.rutas');
const rutasUsuarios = require('./rutas/usuarios.rutas');
const rutasComentarios = require('./rutas/comentarios.rutas');
const PORT = process.env.PORT || 3000;

app.use('/recetas', rutasRecetas);
app.use('/ingredientes', rutasIngredientes);
app.use('/recetas', rutasPasos);
app.use('/categorias', rutasCategorias);
app.use('/auth', rutasUsuarios);
app.use('/usuarios', rutasUsuarios);
app.use('/recetas', rutasComentarios)
app.use('/comentarios', rutasComentarios)

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

pool.query('SELECT NOW()')
    .then(resultado => {
        console.log('Conexión con PostgreSQL exitosa');
        console.log(resultado.rows[0]);
    })
    .catch(error => {
        console.error('Error al conectar con PostgreSQL:', error.message);
    });