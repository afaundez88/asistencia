const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Permitir solicitudes desde cualquier origen
app.use(express.json());

// Rutas de ejemplo
app.get('/api/usuarios', (req, res) => {
  res.json([{ id: 1, nombre: 'Usuario 1' }]);
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});