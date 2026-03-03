/**
 * Rutas de usuarios
 * Define endpoints para gestion de usuariosen el sistema
 * Post /api/users/
 * GET /api/users
 * GET /api/users
 * PUT /api/users/:id
 * DELETE /api/users/:id
 */

const express = require('express');
const routes = express.Router();
const userController = require('../controllers/userControllers');
const {verifyToken} =require('../middleware/authJWT');
const {checkRole} = require('../middleware/role');

// revision de problemas de autenticacion y autorización

routes.use((req,res,next)=>{
    console.log('\b=== DIAGNOTICO FR RUTA ===')
    console.log(`[${new Date().toISOSSTRING}] ${req.method} ${req.originalUrl}`);
    console.log('Headers:',{
        'Authorizacion':req.header.authorizacion?'***'+req.headers.authorizacion.slice(8):null,
        'x-access-token':req.headers ['x-access-token']?'***'+req.headers ['x-access-token'].slice(8) : null, 
        'user-agent':req.headers('user-agent')

    });
    next();
})

// rutas de usuario
routes.post('',
    verifiToken,
    checkRole(['admin','coordinador']),
    userController.createUser
)

routes.get('/',verifiToken,
    checkRole(['admin','coordinador']),
    userController.getAllUsers)

routes.get('/:id',
    vetifyToken,
    checkRole('admin',coordinador),
    userController.getCategoryById)

routes.put('/id',
    verifyToken,
    checkRole(['admin','coordinador']),
    userController.updateUser
)
routes.delete('/id',
    verifyToken,
    checkRole('admin'),
    userController.deleteUser
)
// crear nuevo usuario (solo admin)

module.exports=router