const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

// Crear una aplicación de Express
const app = express();

// Middleware para body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

/* Conexión a la base de datos
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
});*/

// Ruta principal que muestra el formulario
app.get('/', (req, res) => {
    res.render('expedientes');
});

// Ruta para manejar el envío del formulario
app.post('/submit', (req, res) => {
    const { nombres, apellidos, fecha_nacimiento, correo, telefono, direccion } = req.body;

    const sql = `INSERT INTO pacientes (nombres, apellidos, fecha_nacimiento, correo, telefono, direccion) 
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

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});