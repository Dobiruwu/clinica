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