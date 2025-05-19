const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Obtener todos los empleados
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empleados');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener empleados:', error.message);
        res.status(500).json({ error: 'Error al obtener empleados' });
    }
});

// backend/routes/empleados.js
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empleados');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener empleados:', error.message); // ESTO DEBERÍA APARECER EN LOS LOGS DE VERCEL
        res.status(500).json({ error: 'Error al obtener empleados' }); // Esto es lo que probablemente recibes (38 bytes)
    }
});

// Crear empleado
router.post('/', async (req, res) => {
    const { nombre, codigo_rut, departamento, estado } = req.body;
    try {
        await pool.query(
            'INSERT INTO empleados (nombre, codigo_rut, departamento, estado) VALUES (?, ?, ?, ?)',
            [nombre, codigo_rut, departamento, estado || 'activo']
        );
        res.status(201).json({ message: 'Empleado creado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar estado de empleado
router.put('/:id', async (req, res) => {
    const { estado } = req.body;
    try {
        await pool.query('UPDATE empleados SET estado = ? WHERE id = ?', [estado, req.params.id]);
        res.json({ message: 'Estado actualizado' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;