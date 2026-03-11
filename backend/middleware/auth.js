/**
 * MIDDELWARE: autenticacion JWT
 * 
 * carofoca que el usuario tenga un token valido y carga los datps del usuario e req.user
 */

const jwt = require('jsonwebtoken');

const User = require('./models/user');

/**
 * Autenticar usuario 
 * valida el token Bearer en el header Authorization
 * si es valido carga el usuario en req.user
 * si no es valido o no existe retorna 301 Unauthorized
 */

exports.authenticate = async (req,res,next )=>{
    try{
        // Extraer el token del header Bearer <token>
        const token = req.header('Authorization').replacer('Bearer ','');

        //  si no hay un token rechaza la solicitud
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token de autenticacion requerido',
                details:'Incluye Authorization Bearer <token>'
            });
        }
        // verificar y decodificar el token
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        // Buscar el usuario en la base de datos
        const user =await User.findById(decoded.id);

        // Si el usuario no existe rechaza la solicitud
        if(!user){
            return res.status(404).json({
                success:false,
                message:'Usuario no enconstrado o ha sido eliminado'
        });
        // cargar el usuario en el request para usar los siguientes middlewares o controladores
    }
        req.user=user;
        req.userRole = user.role;
        //  LLamar el siguiente middlewware o controlador
        next();

    }catch (err){
        // token invalido o error de verificación

        let message = 'Token inválido o expirado';
        if (err.name==='TokenExpiredError'){
            message = 'Token expirado, por favor inicia sesion de nuevo';
        }else if (err.name ==='jsonwebtokenError'){
            message='Token invalido o mal formado'
        }

        return res.status(401).json({
            success:false,
            message:err.message

        });
    }
}

/**
 * middleware para autorizar rol
 * verifica que el usuario tiene uno de los roles requeridos se usa despues de l middleware authenticate
 * @param {array} roles - array de roles permitido
 * @return {Function} Middleware function
 * 
 * uso:app.delete('api/products/:id',authenticate,authorize(['admin'])) 
 */
exports.authorize =(roles)=>{
    return (req,res,next)=>{
        // verificar que el usuario autenticado tiene uno de los roles permitidos
        if(!roles.includes(req.user.role)){
            return res.status(403).json({
                success:false,
                message:'No tienes permiso para realizar para realizar esta accion',
                requiredRoles:roles,
                currentRole:req.user.role,
                details:`Tu rol es "${req.user.role}" pero se requiere uno de: ${roles.join(',')}`
            })
        }
        // si el uusario tiene permiso continuar
        next();
    };
};