const express = require('express');
const routes = express.Router();
const userController = require('../controllers/userControllers');

const { verifyToken } = require('../middleware/authJWT');
const { checkRole } = require('../middleware/role');

routes.use((req,res,next)=>{
    console.log('\n=== DIAGNOSTICO DE RUTA ===')
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Headers:',{
        'authorization':req.headers.authorization ? '***'+req.headers.authorization.slice(8):null,
        'x-access-token':req.headers['x-access-token'] ? '***'+req.headers['x-access-token'].slice(8) : null,
        'user-agent':req.headers['user-agent']
    });
    next();
})

routes.post('/',
    verifyToken,
    checkRole('admin','coordinador'),
    userController.createUser
)

routes.get('/',
    verifyToken,
    checkRole('admin','coordinador'),
    userController.getAllUsers
)

routes.get('/:id',
    verifyToken,
    checkRole('admin','coordinador'),
    userController.getUserById
)

routes.put('/:id',
    verifyToken,
    checkRole('admin','coordinador'),
    userController.updateUser
)

routes.delete('/:id',
    verifyToken,
    checkRole('admin'),
    userController.deleteUser
)

module.exports = routes