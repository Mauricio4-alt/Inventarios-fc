
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


const user = require('../models/user')
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
        users =await user.find({
            _id:req.userId,
            ...activeFiltes
        }).select('password');
    }else{
        // los admin y coordinadores ven todos los usuarios
        users = await user.find(activeFiltes).select('-password');

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
    


exports.createUser = async (requestAnimationFrame,res)=>{
    try{
        const {name,email,password,role} =requestAnimationFrame.body
        const savedUser = await user.save();
    
    res.status(201).jsons({
        success:true,
        message:'Usuario creado',
        user:{
        id:savedUser._id,
        username:savedUser.username,
        email:savedUser.email,
        role:savedUser.role
    }
    });
    }catch(err){
        console.error('Error el en servidor',err)
        return res.status(500).json({
            success:false,
            message:'Hubo un error al conectarse con el servidor',
            error:err.message
        });
    }
       
};
/**
 * Update actualizar un usuario existente
 * Put /apu/users/:id
 * Auth Bearer token requerido
 * validaciones
 * auxiliares solo pueden actualizar su perfil
 * auxiliar no puede cambiar su rol
 * admin,coordinador pueden actualizar otros usuarios 
 * 200 usuario actualizado
 * 403 sin persmiso para actualizar 
 * 404 usuario no encontrado
 * 500 error de servidor
 */

exports.updateUser = async (req,res)=>{
    try{
        // Restriccion: auxiliar solo púede acualizar su propio perfil
        if(req.userRole==='auxiliar' && req.userId.toString!==req.params.id){
            return res.status(403).json({
                success:false,
                message:'no tienes permiso para actualizar este usuario'
            });
        }
        // Restriccion: auxiliar solo púede acualizar su propio perfil
        if(req.userRole==='auxiliar' && req.body.role){
            return res.status(403).json({
                success:false,
                message:'no tienes permiso para modificar tuu rol'
            });
        }

        // Actualizar usuarios
        const updatedUser = await user.findByIdAndUpdate(
            req.params.id,
            {$set:req.body},
            {new:true} //retorna el documento actualizado
        ).select('-password'); // no retornar contraseña
        
        if(!updatedUser){
            return res.status(404).json({
                success:false,
                message:'Usuario no encontrado'

            })
        }
        res.status(200).json({
            success:true,
            message:'Usuario actualizado con éxito',
            user:updatedUser
        })

    }catch(err){
        console.error('Error en conectar al servidor',err)
        return res.status(500).json({
            success:false,
            message:'Error interno en el servidor',
            error:err.message
        })
    }
}

/**
 * Delete eliminar usuario
* delete /api/users/:id
* roles:admin
* query params:
* hardDelete = true eliminar permanentemente
* default soft delete desactiva
* el admin solo puede desactivar otro admin
* 403 sin permiso
* 404 usuario no encontrado
* 500 error de servidor
*/ 
exports.deleteUser = async (req,res) =>{
    try{
        const isHardDelete =req.query.harDelete ==='true';
        const userToDelete = await user.findById(req.params.id)
        if(!userToDelete){
            return res.status(404).json({
                success:false,
                message:'Usuario no encontrado'

            })
        } 
        // if(req.userRole!=='Admin'){
        //     return res.status(403).json({
        //         success:false,
        //         message:'No estas autorizado para realizar esta acció'
        //     })
        // }
    // proteccion no permitir desactivar otros admin        
    // solo el admin puede desactivarse o eliminar otros admin
    if(userToDelete.role==='admin' && userToDelete._id.toString()){
        return res.status(403).json({
            success:false,
            message:'no tienes permiso para eliminar o desativar administradores'
        })
    } 
    if(isHardDelete){
        // Eliminar permamentetemente
        await user.findByIdAndUpDelete(req.params.id);
        res.status(200).json({
            success:true,
            message:'Usuario desactivado',
            data:userToDelete
        })
    }
    }catch(err){
        console.error('Error en deleteUser',err);

        res.status(500).json({
            success:false,

        })
    }



}}
