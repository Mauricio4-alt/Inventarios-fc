
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/auth.config')


exports.signup = async (req,res) => {
    try{
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'auxiliar'
        });

        
        const savedUser = await newUser.save()

        
        const token = jwt.sign({
            id:savedUser._id,
            role:savedUser.role,
            email:savedUser.email
        },
        config.secret,
        {expiresIn:config.jwtExpiration}
    )
    
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



exports.signin = async (req,res) => {
    try{
       
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

    
    const user = await User.findOne({
        $or:[
            {username:req.body.username},
            {email:req.body.email}
            
        ]
    }).select('+password') 
         if (!user){
            return res.status(404).json({
                succes:false,
                message:'Usuario no encontrado'
            });
         }

       
        if(!user.password){
            return res.status(400).json({
                succes:false,
                message:'Error interno: usuario sin contraseña '
            })
        }
        
        const isPasswordValid = await bcrypt.compare(
            req.body.password,user.password
        )
        if (!isPasswordValid){
            return res.status(401).json({
                succes:false,
                message:'Contraseña incorrecta'
            })
        }
    
    const token = jwt.sign(
        {
            id:user._id,
            role:user.role,
            email:user.email,

        },
        config.secret,
        {expiresIn:config.jwtExpiration}
    );
    
    const UserResponse={
        id:user._id,
        username:user.username,
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



