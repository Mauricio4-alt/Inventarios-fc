/**
 * MIDDELWARE: autenticacion JWT
 * 
 * carofoca que el usuario tenga un token valido y carga los datps del usuario e req.user
 */

const jwt = require('jsonwebtoken')

const User = require('../models/user')

/**
 * Autenticar usuario 
 * valida el token Bearer en el header Authorization
 * si es valido carga el usuario en req.user
 * si no es valido o no existe retorna 301 Unauthorized
 */

exports.authenticate = async (req,res,next )=>{
    try{
        // Extraer el token del header Bearer <token>
        const token = req.header('Authorizaion').replacer('Bearer ','');

        //  si no hay un token rechaza la solicitud
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token de autenticacion requerido',
                details:'Incluye Authorization Bearer <token>'
            })
        }
    }catch (err){}
}