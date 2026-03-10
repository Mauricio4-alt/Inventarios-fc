/**
 * Middleware de verificación JWT
 */

const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const verifyToken = (req, res, next) => {
    try {
        let token = null;

        // Obtener token desde headers
        const authHeader = req.headers['authorization'];
        const accessToken = req.headers['x-access-token'];

        if (authHeader) {
            // Puede venir como "Bearer token"
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.slice(7); // quita "Bearer "
            } else {
                token = authHeader;
            }
        } 
        else if (accessToken) {
            token = accessToken;
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

module.exports = {
    verifyToken
};