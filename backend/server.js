const express = require('express');
const cors = require('cors');
const empleadosRoutes = require('./routes/empleados');
const registrosRoutes = require('./routes/registros');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS para permitir solicitudes desde el dominio de Vercel
app.use(cors({
    origin: ['http://localhost', 'https://asistencia-chi.vercel.app', 'https://asistencia-idzhv7mlz-afaundezs-projects-c3cd0384.vercel.app'] // Permitir localhost y Vercel
}));
app.use(express.json());

// Rutas de la API
app.use('/api/empleados', empleadosRoutes);
app.use('/api/registros', registrosRoutes);

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});