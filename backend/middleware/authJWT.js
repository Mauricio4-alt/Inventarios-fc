/**
 * MIDDEWARE DE VERIFICACION JWT
 * middelware para verificar y validar el tokens JWT en las solicitudes 
 * se usa token en todas las rutas protegidas para autenticar usuarios
 * caracteristicas:
 * soporta dos formatos de token
 * 1 Authorization: Bearer <token> (Estandar REST)
 * 2 x-access-token (header personalizado)
 * extrae informacion del token (id role email)
 * la adjunta a req.userId req.userRole, req.userEmail para uso en los controladores
 * manejo de erroes con codigos http 403/401 apropiados
 * flujo:
 * 1. lee el token header Authorization o x-access-token
 * 2. Extrae el token (quita el Bearer si es necesario)
 * 3. verifica el token con JWT_SECRET
 * 4. si es valido continua al siguiente middeware 
 * 5. si es invalido retorna 401 Unauthorized
 * 6. si falta retorna 403 Forbidden
 * 
 * Validacion del token 
 * 1. verifica criptografica con JWT_SECRET
 * 2. comprueba que no haya expirado
 * 3. extrae ppayload {id,role,email}
 * 
 */


const jwt =require('jsonwebtoken')
const config =require('../config/auth.config')

/**
 * verificar el token
 * funcionalidad
 * busca el token en las ubicaciones posibles(orden de procedencia)
 * 1. headr Authorization con formato Bearer <token>
 * 2. header x-acces-token
 * si encuentra el token verifica su validez 
 * si no encuentra el token retorna 403 Forbidden
 * si token es invalido retorna 401 Unauthorized
 * Si es valido adjunta datos del usuario a req y continua 
 *
 * Headers soportados:
 * 1. Authorization bearer <abcsahcsahciashioas...>
 * 2. x-access-token: <dhujasodjasoijdaso..>id,role,email
 * propiedades del request despues del middleware:
 * req.userId = (String)id del usuario MongoDD
 * req.useRole = (string) rol del usiario (admin,coordinador,auxiliar)
 * req.userEmail = (string) email del usuario
 */

const verifyToKenFn = (req,res,next)=>{
    try{
        // soportar dos formatos Authorization bearero access-token
        let token =null

        // formato Authorization
        if(req.headers.authorization && req.headers.authorization.starWith('Bearer ')){
            // Extraer token quitando el Bearer
            token = req.headers.authorization.substring(7);
        }
        // Formato access-token
        else if(req.headers['x-access-token'] ){
            token =req.headers['x-access-token']
        }
        //  si no se encontro tolen rechaza la solicitud
        if(!token){
            return res.status(403).json({
                success:false,
                message:'Token no proporcionado'

            })
        }

        // verificar el token con la clave secreta

        const decoded =jwt.verify(token,config.secret)

        //  adjuntar información del usuario al request object para que otros middelwares y rutas puedan acceder a ella
        req.userId = decoded.id //id mongoDb
        req.userRole =decoded.role; // Rol de usuario
        req.userEmail = decoded.email // email usuario

        // token es valido continuar siguientes middlware o ruta
        next()
    }catch(err){
        // n token invalido o expirado
        return res.status(401).json({
            success:false,
            message:'Token invalido o expirado',
            error:err.message
        })
    }
}

/**
 * validacionde funcion para mejor seguridad y manejo de errores
 * verificar que verifyTokenFn sea un funcion valida 
 * esto es una validacion de seguridad para que el middleware se exporte correctamente
 * si algo sale mal en su definicion lanzara un error en tiempo de carga  del modulo
 */
if(typeof verifyToKenFn!== 'function')
{
    console.error('Error:verifyTokenFn no es una funcion valida|')
    throw new Error('verifiTokenFn no es una funcion valida')
}

//  exportar el middleware
module.exports ={
    verifyTokenFn:verifyToKenFn
}