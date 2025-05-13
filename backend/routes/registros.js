const express = require('express');
const pool = require('../config/db');
const router = express.Router();

// Registrar marcaje
router.post('/', async (req, res) => {
    const { codigo_rut_empleado, tipo } = req.body;
    try {
        const [empleados] = await pool.query('SELECT id FROM empleados WHERE codigo_rut = ?', [codigo_rut_empleado]);
        if (empleados.length === 0) {
            return res.status(404).json({ error: 'Empleado no encontrado' });
        }
        await pool.query(
            'INSERT INTO registros (empleado_id, codigo_rut_empleado, tipo, origen) VALUES (?, ?, ?, ?)',
            [empleados[0].id, codigo_rut_empleado, tipo, 'Web App Kiosco']
        );
        res.status(201).json({ message: `${tipo} registrada` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener registros con filtros
router.get('/', async (req, res) => {
    const { codigo_rut, fecha_inicio, fecha_fin } = req.query;
    let query = 'SELECT r.*, e.nombre FROM registros r JOIN empleados e ON r.empleado_id = e.id';
    const params = [];
    let conditions = [];

    if (codigo_rut) {
        conditions.push('r.codigo_rut_empleado = ?');
        params.push(codigo_rut);
    }
    if (fecha_inicio) {
        conditions.push('r.fecha_hora >= ?');
        params.push(fecha_inicio);
    }
    if (fecha_fin) {
        conditions.push('r.fecha_hora <= ?');
        params.push(fecha_fin);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY r.fecha_hora DESC LIMIT 100';

    try {
        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;