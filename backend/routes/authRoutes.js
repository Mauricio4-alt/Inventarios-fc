/**
 * Rutas de autenticacion
 * define los endpoitns relativos a autenticacion de usuariis
 * post /api/auth/signin registrat un nuevo usuario
 */

const express = require('express');
const router =express.Router();
const authController = require('../controllers/authControllers');
const {verifySingUp} = require('../middleware');
const {verifyToken} =require('../middlewares/authJWT')


const {checkRole} = require('../middlewares/role');

// Rutas de autenticación

// requiere email-usuario y password
router.post('/sigin',authController.signin);
router.post('Signup', 
    verifyToken,
    checkRole('admin'),
    verifySingUp.checkDuplicateUsernameOrEmail,
    verifySingUp.checkRolesExisted,
    authController.SIGNUP

)


module.exports =router;