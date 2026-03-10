/**
 * Middleware de verificación JWT
 */

const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const verifyToken = (req, res, next) => {
    try {

        // 👇 AGREGAR AQUÍ
        console.log("HEADERS:", req.headers);

        let token =
            req.headers['x-access-token'] ||
            req.headers['authorization'];

        if (!token) {
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        if (token.startsWith('Bearer ')) {
            token = token.split(' ')[1];
        }

        const decoded = jwt.verify(token, config.secret);
        console.log("DECODED:", decoded);
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