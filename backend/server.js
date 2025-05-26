const express = require('express');
const cors = require('cors');
const empleadosRoutes = require('./routes/empleados');
const registrosRoutes = require('./routes/registros');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS para permitir solicitudes desde el frontend
app.use(cors({
    origin: 'http://localhost' // Origen del frontend
}));
app.use(express.json());

app.use('/api/empleados', empleadosRoutes);
app.use('/api/registros', registrosRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});