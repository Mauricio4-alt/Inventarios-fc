/**
 * archivo indice de middlewares
 * centraliza la importacion de todos los middlewares de autenticacion y autorización
 * permite importar multiples middlewares de forma concisa en las rutas
 */

const authJWT = require('./auth')
const verifySignUp = require('./verify')

// Exportar los middlewares agrupados o modulo

module.exports = {
    authJWT: require('./authJWT'),
    verifySignUp: require('./verify'),
    role: require('./role')
};