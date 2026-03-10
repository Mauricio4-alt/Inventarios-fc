
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
    console.log("TOKEN GENERADO:", token)
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
            success:false,
            message:'Error al registrar un usuario',
            error:err.message
        })
    }
}



exports.signin = async (req, res) => {
    try {

        //Validar que se envie el email o username - &&: para multiples condiciones verderas 
        if (!req.body.email && !req.body.username) {
            return res.status(400).json({
                success: false,
                message: 'Email o Username requerido!'
            });
        }

        //validar que se envie la contraseña
        if (!req.body.password) {
            return res.status(400).json({
                success: false,
                message: 'Contraseña requerida'
            });
        }

        //Buscar usuario por email o username
        const user = await User.findOne({
            $or: [ // funciona como un "o" lógico - ARRAY - agarra cualquiera de los dos o los que esten - guardar datos en un array
                { username: req.body.username },
                { email: req.body.email }
            ]
        }).select('+password'); //Include password field - fuerza a mongo que incluye el campo de password 

        //Si no existe el usuario 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Verificar que el usuario tenga contraseña
        if (!user.password) {
            return res.status(500).json({
                success: false,
                message: 'El usuario no tiene contraseña!'
            });
        }

        // Comparar la contraseña enviada con el hash almacenado - HASH: Contraseña encriptada - trae archivo plano
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Contraseña incorrecta!'
            });
        }

        //Generar token JWT que expira en 24 horas
        const token = jwt.sign( // compara 
            {
                id: user._id,
                role: user.role,
                email: user.email
            },
            config.secret,
            { expiresIn: config.jwtExpiration }
        );

        // Prepara respuestas sin mostrar la contraseña
        const userResponse = { // solo muestra datos seguros no contraseña
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        //POSTMAN 200 AFIRMATIVO - Usuario registrado exitosamente
        res.status(200).json({
            success: true,
            message: 'Inicio de sesion exitoso!',
            token: token,
            user: userResponse
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error en el inicio de sesión!'
        });
    }
};


