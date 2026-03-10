/**
 * Middleware de verificación JWT
 */

const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const verifyTokenFn = (req, res, next) => {
    try {
        let token = null;

        // Formato Authorization: Bearer <token>
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1]; // divide en 'Bearer' y el token
        }
        // Formato x-access-token
        else if (req.headers['x-access-token']) {
            token = req.headers['x-access-token'];
        }

        // Si no hay token
        if (!token) {
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, config.secret);

        // Adjuntar datos al request
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userEmail = decoded.email;

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado',
            error: err.message
        });
    }
};

// Validación de si verifyTokenFn es una función
if (typeof verifyTokenFn !== 'function') {
    console.error('[AuthJWT Error: verifyTokenFn no es una función]');
    throw new Error('verifyTokenFn debe ser una función');
}

module.exports = {
    verifyToken: verifyTokenFn
};
