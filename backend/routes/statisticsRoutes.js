/**
 * rutas de las estadisticas
 * dfine el endpoint para obtener las estadisticas generales del sistema
 */

const express = require('express')
const router = express.Router();
const {getStatistics} =require('../controllers/statisticsControllers');

// Get/api/statistics obtiene las esadisticas del sistema

router.get('/',getStatistics);

module.exports =router;