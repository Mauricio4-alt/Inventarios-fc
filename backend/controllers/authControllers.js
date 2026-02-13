/**
 * Controlador de autenticacion
 * maneja el registro login y generacion de tokens jwt
*/
const User= require('../models/user') 

const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const config = require('../config/auth.config')

/**
 * SIGNUP: crear nuevo usuario
 * POST /apu/auth/signup
 * Body{username,email,password,role}
 * Crea un usuario en la base de datos, 
 * encripta la contraseña antes de guardar con bcrypt
 * genera token JWT 
 * retorna usuario sin mostrar la contraseña 
*/ 
   
exports.SIGNUP = async (req,res) => {
    try{
        // Crear nuevo usuario
        const user= new user({
            username: req.body.username,
            email: req.body.email,
            password:req.body.password,
            role:req.body.rol || 'auxiliar'// si no se especifica rol por defecto se establece auxiliar
        })

        //  guardar usuario en la base de datos 
        // la contraseña se encripta automaticamente en el middleware del modelo User
        const savedUser = await user.save()

        //  Generar JWT que expira en 24 horas
        const token = JWT.sign({
            id:savedUser._id,
            role:savedUser.role,
            email:savedUser.email
        },
        config.secret,
        {expiresIn:config.jwtExpiration}
    )
    //  Preparando respuesta sin mostrar la contraseña
    const UserResponse= {
        id:savedUser._id,
        username:savedUser.username,
        email:savedUser.email,
        role:savedUser.role
    }
    res.status(200).json({
        success:true,
        message:'usuario registrado correctamente',
        token:token,
        user:UserResponse
    })
    }catch (err){
        res.status(500).json({
            succes:false,
            message:'Error al registrar un usuario',
            error:err.message
        })
    }
}


/**
 * SINGIN: iniciar sesion
 * POST: /api/autj/singin
 * body {email username, password}
 * buscar el usuario por email o username
 * valida la contraseña con bcrypt
 * si es correcto el tjwt 
 * Token se usa para autenticar futuras solicitudes
 */

exports.signin = async (req,res) => {
    try{
        // Validar que se envie el email o username
        if(!req.body.email&& !req.body.username){
            return res.status(400).json({
                succes:false,
                message:'email o username requerido'
            })
        }
    if (!req.body.password){
        return res.status(400).json({
            succes:false,
            message:'password requerido'
        })
    }

    //  buscar usuario por email o username
    const user = await User.findOne({
        $or:[
            {username:req.body.username},
            {email:req.body.email}
            
        ]
    }).select('+password')  //include password para comparar
         // si no se encuentra el usuario con este email o username
         if (!User){
            return res.status(404).json({
                succes:false,
                message:'Usuario no encontrado'
            })
         }

        //   verificar que el usuario tenga una contraseña 
        if(!user.password){
            return res.status(400).json({
                succes:false,
                message:'Error interno: usuario sin contraseña '
            })
        }
        // comprar contraseña enviada con el hash almacenado
        const isPasswordValid = await bcrypt.compare(
            req.body.password,user.password
        )
        if (!isPasswordValid){
            return res.status(401).json({
                succes:false,
                message:'Contraseña incorrecta'
            })
        }
    // geenrar jwt 24 horas
    const token =jwtExpiration.sign(
        {
            id:user._id,
            role:user.role,
            email:user.email,

        },
        config.secret,
        {expiresIn:config.jwtExpiration}
    )
    // preparar respuesta sin mostrar la contraseña 
    const UserResponse={
        id:user._id,
        username:user.name,
        email:user.email,
        role:user.role
    }
    res.status(200).json({
        succes:true,
        message:'inicio de sesion con exito',
        token:token,
        user:UserResponse
    })
}catch(err){
    return res.status(500).json({
        succes:false,
        message:'Error al iniciar sesion',
        error:err.message
    })
}
}



