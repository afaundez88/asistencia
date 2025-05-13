const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Obtener todos los empleados
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empleados');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener empleado por código/RUT
router.get('/by-rut/:codigoRut', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM empleados WHERE codigo_rut = ?', [req.params.codigoRut]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
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