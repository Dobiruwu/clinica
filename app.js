const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

// Crear una aplicación de Express
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Para servir archivos estáticos
app.set('view engine', 'ejs'); // Cambia esto si usas otro motor de plantillas
app.set('views', path.join(__dirname, 'views')); // Cambia la ruta según la ubicación de tus vistas

// Rutas

// Ruta principal que muestra la lista de pacientes
app.get('/pacientes', (req, res) => {
    res.render('pacientes'); // Asegúrate de que este archivo exista en la carpeta de vistas
});

// Ruta para la lista de expedientes
app.get('/expedientes', (req, res) => {
    res.render('expedientes'); // Crea este archivo para mostrar los expedientes
});

// Ruta para la lista de recetas
app.get('/recetas', (req, res) => {
    res.render('recetas'); // Crea este archivo para mostrar las recetas
});

// Ruta para la lista de documentos
app.get('/documentos', (req, res) => {
    res.render('documentos'); // Crea este archivo para mostrar los documentos
});

// Ruta para la gestión de usuarios
app.get('/usuarios', (req, res) => {
    res.render('usuarios'); // Crea este archivo para gestionar usuarios
});

// Ruta para la gestión de roles
app.get('/roles', (req, res) => {
    res.render('roles'); // Crea este archivo para gestionar roles
});

/* Conexión a la base de datos */
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clinica_ortopedista'
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Ruta principal que muestra el formulario
app.get('/', (req, res) => {
    res.render('pacientes');
});

// Ruta para manejar el envío del formulario de pacientes
app.post('/submit', (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, correo, telefono, direccion } = req.body;

    const sql = `INSERT INTO paciente (nombre, apellido, fechaNacimiento, correo, telefono, direccion) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nombres, apellidos, fecha_nacimiento, correo, telefono, direccion], (err, result) => {
        if (err) {
            console.error('Error al insertar los datos:', err);
            res.send('Hubo un error al guardar los datos.');
        } else {
            res.send('Paciente registrado exitosamente.');
        }
    });
});
// Ruta para obtener los datos de pacientes de la BD
app.get('/pacientes', (req, res) => {
    const sql = 'SELECT * FROM paciente';  // Nombre de la tabla correcto

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener los pacientes:', err);
            return res.status(500).send('Hubo un error al obtener los pacientes.');
        }
        const pacientesConNuevosNombres = results.map(paciente => ({
            nombreCompleto: `${paciente.nombre} ${paciente.apellido}`,
            fechaNacimiento: new Date(paciente.fechaNacimiento).toLocaleDateString('es-ES'),
            correo: paciente.correo,
            telefono: paciente.telefono,
        }));
        res.render('pacientes', { pacientes: pacientesConNuevosNombres });
    });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});