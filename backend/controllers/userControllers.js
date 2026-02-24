const user = require("../models/user");

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


}
