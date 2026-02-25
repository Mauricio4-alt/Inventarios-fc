/**
 * Controlador de usuarios 
 * Este modulo maneja todas las operaciones del crud para gestion de usuarios
 * incluye control de acceso basado en roles
 * Roles permitidos admin, coordinador auxiliar
 * Seguridad
 * las contraseñas nunca se devuelven en respuestas
 * los auxiliares no pueden ver otros y actualizar otros
 * los coordinadores no pueden  ver los administradores 
 * activas y desactivar usuarios
 * eliminar permanentemente un usuario solo admin
 * 
 * Operaciones
 * getAlluser listar usuarios con filtro por rol
 * getUserById obtener usuario específico
 * createUser crear un nuevo usuario con validación
 * updateUser actualizar usuario con restricciones de rol
 * delete user eliminar usuario con restricciones de rol  
*/


const User = require('../models/user')
const bcrypt=require('bcrypt')

/**
 * Obtener lista de usuarios
 * GET /api/users
 * Auth token requerido
 * query params incluir activo o desactivados
 * 
 * retorna 
 * 200 array de usuarios filtrados
 * 500 error de servidor
*/
 
exports.getAllUsers = async (req,res)=>{
    try{
        // por defecto solo mostrar usuarios activos
        const includeInactive = req.query.includeInactive === 'true';
        const activeFiltes = includeInactive?{}:{active:{$ne:false}}
    
    let users;
    // Control de acceso basado en rol
    if(req.userRole==='auxiliar'){
        // Los auxiliares solo pueden verse asi mismos
        users =await User.find({
            _id:req.userId,
            ...activeFiltes
        }).select('password');
    }else{
        // los admin y coordinadores ven todos los usuarios
        users = await User.find(activeFiltes).select('-password');

    }
    res.status(200).json({
        success:true,
        data:users
    })
    
    }catch(error){
        console.error('[CONTROLLER]: Error en getAllUsers',error.message)
        res.status(500).json({
            success:false,
            message:'Error en obtener todos los usuarios'
        });
    }
       
}

/**
 * READ obtener un usuario específico por id
 * GET /api/users/:id
 * auth token requerido
 * respuestas
 * 200 usuario encontrado
 * 403 sin permiso para ver el usuario
 * 404 usuario no encontrado
 * 500 error en el servidor
 */

exports.getUserByID = async (req,res)=>{
     try{
        // por defecto solo mostrar usuarios activos
        const user = await user.findById(req.params.id).select('.password');
    
    if(!user){
        return res.status(404).json({
            succes:false,
            message:'Usuario no encontrado'
        })
    }
 
    // validaciones de acceso
    // los auxiliares solo pueden ver su propio perfil
    if(req.userRole==='auxiliar' && req.userId!==user.id.toString()){
        return res.Status(403).json({
            success:false,
            message:'No tiene permisos para ver este usuario'
        })
    }
    // validaciones de acceso
    // los coordinadores no pueden ver admins
    if(req.userRole==='coordinador' && role ==='admin'){
        return res.Status(403).json({
            success:false,
            message:'No tiene permisos para ver este usuario'
        })
    }
    res.status(200).json({
        success:true,
        user
    })
    
    }catch(error){
        console.error('[CONTROLLER]: Error en getAllUsers',error.message);
        res.status(500).json({
            success:false,
            message:'Error en obtener todos los usuarios'
        });
    }
    
}
