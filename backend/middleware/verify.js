/**
 * middleware de validacion del signup
 * 
 * middleware para validar datos durante el proceso de registro de nuevos usuarios
 * se ejecuta en la ruta post /api/auth/signup despues de verificar el token
 * validaciones:
 * 1. checkDuplicateUsernameorEmail: verifica inicidad del username e email
 * 2. checkRolesExisted: valida que el rol solicitado sea valido
 * 
 * Flujo de signup:
 * 1. Cliente envia post /api/auth/signup con datos
 * 2. verifyTOken verifica que usuario autenticado admin 
 * 3. checkRole ('admin') verifica que es admin 
 * 4. checkDuplicateUsernameOrEmail valida unicidad
 * 5. checkRolesExisted valida rol
 * 6. authController.signup crea usuario si todo es valido 
 * 
 * Errores retornados:
 * 400 username / email duplicado o rol invalido
 * 500 error de base de datos
 * 
*/
 const User = require('../models/user');

/**
 * verificar que username e email sean único
 * validaciones:
 * username no debe existir en la base de datos
 * email no debe existir en la base de datos 
 * ambos campos deben estar presentes en el request
 * 
 * Busqueda: usa MongoDD %or para verificar ambas condiciones en una sola consulta
 * @param {Object} req request object con req.body{username,email}
 * @param {Object} res response object para enviar errores 
 * @param {Function} next Callback al siguiente middleware 
 * 
 * respuesta:
 * 400 si username/email falta o ya existe
 * 500 error en base de datos
 * next() si la validación pasa 
 */


const checkDuplicateUsernameOrEmail = async (req,res,next) =>
    {
        try
        {
            //  validar que ambos campos estén presentes
            if(!req.body.username || !req.body.email)
            {
                return res.status(400).json({
                    message:'tanto el  username como el email son requeridos'
                })
            }
            // buscar usuarios existente con mismo username e email
            const user = await User.findOne({
                $or:[
                    {username:req.body.username},
                    {email:req.body.email},
                ]
            }).exec();
            //  si encuentra un usuario retorna error 
            if(user)
            {
                return res.status(400).json({
                    success:false,
                    message:'Username o email ya existe '
                })
            }
            // Continuar si ya no hay duplicados 
            next()
        }
        catch (err)
    {
        console.error('[verifySignUp]Error en checkDuplicateUsernameOrEmail',err)
        return res.status(500).json({
            success:false,
            message:'Error al verificar credenciales',
            error:err.message
        })
    }
    }
    
/**
 * Middleware verificar que el rol solicitado sea válido
 * roles válidos en el sistema:
 * admin: Administrador Total
 * coordinador: gestor de datos
 * auxiliar usuario basico 
 * caracteristicas
 * permite pasar solo un rol
 * Filtrar y rechazar roles no válidos
 * si algun rol es inválido rechaza la peticion
 * si campo rol no está presente permite continuar defaul el rol es auxiliar
 * @param {Object} req request object con req.body.{roles...}
 * @param {Function} next callback al siguiente middleware 
 * respuestas:
 * 400 si alguno de los roles es invalido
 * next() si todos los roles son validos o no se especifica el rol 
 */

 const checkRolesExisted = (req,res,next) =>{
    // lista blanca de roles válidos en el sistema 
    const validRoles = ['admin','coordinador','auxiliar'];

    // si rol está presente en el request
    if(req.body.role)
    {
        // convertir a array si es string (soporta ambos formatos)
        const roles = Array.isArray(req.body.role) ? req.body.role : [req.body.role];
        // filtrar roles que no están en la lista valida
        const invalidRoles= roles.filter(role=>!validRoles.includes(role));
        //  si hay roles inválidos rechazar
        if (invalidRoles.length>0)
            {
                return res.status(400).json({
                    success:false,
                    message:`Role(es) no validos:${invalidRoles.join(', ')}`
                })
            }    
    }
    // todos los roles son valudos o no especificos continuar
    next();
 };

/**
 * Exportar middlewares
 * uso de rutas:
 * router.post('signup...')
 * 
 * 
 */

module.exports ={
    checkDuplicateUsernameOrEmail,
    checkRolesExisted
};