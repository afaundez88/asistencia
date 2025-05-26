// asistencia/backend/server.js

const express = require('express');
const cors = require('cors');
const empleadosRoutes = require('./routes/empleados'); // Asegúrate que la ruta sea correcta
const registrosRoutes = require('./routes/registros'); // Asegúrate que la ruta sea correcta
require('dotenv').config(); // Para cargar variables de .env en desarrollo local

const app = express();
const port = process.env.PORT || 3000; // Vercel proveerá PORT

// --- Configuración de CORS ---
// Lista de orígenes permitidos
const allowedOrigins = [
    'https://asistencia-chi.vercel.app' // Tu dominio de producción principal
    // Añade aquí el puerto de tu frontend si lo sirves localmente en un puerto diferente al backend
    // Por ejemplo, si tu frontend corre en localhost:5173 y tu backend en localhost:3000:
    // 'http://localhost:5173', 
    // Si abres index.html directamente y tu backend corre en localhost:3000, 
    // el origen 'http://localhost:3000' (o 127.0.0.1) podría ser necesario si haces pruebas
    // directas al backend desde una herramienta o script en ese origen.
    // Si el frontend local no tiene un servidor (file://), la lógica de !origin lo cubrirá.
    'http://localhost:3000', // Si accedes a la API desde una herramienta en el mismo puerto
    'http://127.0.0.1:3000'
];

// Vercel establece VERCEL_URL para el dominio del despliegue actual (incluye previews)
// y VERCEL_ENV puede ser 'production', 'preview', o 'development'
if (process.env.VERCEL_URL) {
    allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}
// Para desarrollo local, donde VERCEL_URL no está definida, y puedes estar usando un puerto específico para el frontend
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL_URL) {
    // Aquí puedes añadir puertos comunes de desarrollo de frontend si no están ya
    // Ejemplo: allowedOrigins.push('http://localhost:5173'); // Para Vite
    // Ejemplo: allowedOrigins.push('http://localhost:8080'); // Para Webpack dev server, etc.
    // Por ahora, el localhost:3000 ya cubre el caso de prueba directa al backend
}


const corsOptions = {
    origin: function (origin, callback) {
        // Permitir solicitudes sin 'origin' (ej. Postman, curl, o si el frontend se sirve desde el mismo dominio exacto)
        // También, 'file://' tiene un origin null.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS Bloqueado: El origen '${origin}' no está en la lista de permitidos.`);
            console.log('Orígenes permitidos actualmente:', allowedOrigins);
            callback(new Error(`El origen ${origin} no está permitido por CORS.`));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Métodos HTTP que permites
    allowedHeaders: "Content-Type,Authorization", // Cabeceras que permites en la solicitud
    credentials: true // Si necesitas manejar cookies o cabeceras de autorización
};

app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.use('/api/empleados', empleadosRoutes);
app.use('/api/registros', registrosRoutes);

// Ruta de prueba simple para verificar que el servidor está arriba
app.get('/api', (req, res) => {
    res.json({ message: 'API de Asistencia funcionando correctamente!' });
});

// Middleware para manejar errores 404 de API (si ninguna ruta API coincidió)
app.use('/api/*', (req, res) => {
    res.status(404).json({ error: 'Ruta API no encontrada' });
});

// Inicia el servidor
// En Vercel, app.listen no es estrictamente necesario de la misma forma que localmente,
// ya que Vercel maneja el servidor por ti. Pero es buena práctica tenerlo para desarrollo local.
// Vercel ejecutará el archivo y exportará la 'app' de Express.
if (process.env.NODE_ENV !== 'test') { // Evitar que escuche en tests si es necesario
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
        // Solo para depuración de CORS en desarrollo:
        console.log("Orígenes CORS permitidos en este momento:", allowedOrigins);
    });
}

// Exportar la app para Vercel (Vercel buscará esto si no usas app.listen de la forma tradicional)
module.exports = app;
