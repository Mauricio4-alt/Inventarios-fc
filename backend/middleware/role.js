/**
 * MIDDLEWARE control de roles de usuario
 * 
 * sirve para verificar que el usuario autenticado tiene
 * permisos necesarios para acceder a una ruta especifica
 * 
 * funcion factory checkRole() permite especificar roles permitidos
 * funcion Helper para roles especificos isAmming, isCoordinador,isAuxiliar
 * Requiere que verifyToken se haya ejecutado primero
 * flujo:
 * verifica que req.userRole exista 
 * compara req.userRole contra lista de roles permitidos
 * si esta en lista continua
 * si no esta en la lista responde con 403 Forbidden con mensaje descriptivo
 * si no existe userRole renorna 401 (Token corrupto)
 * 
 * uso:
 * checkRole  ('admin') solo admin
 * ccheckRole ('admin'.'coordinador') admin y coordinador con permisos
 * 
 * checkRole ('admin'.'coordinador','auxiliar')todos con permisos
 * Roles del sistema:
 * admin acceso total
 * coordinador no puede eliminar ni gestionar usuarios
 * auxiliar acceso limitado a tareas especificas
 */

/**
 * factory function checkRole 
 * retorna middleware que verifica si el rol del usuario tiene uno de los roles permitidos
 * @param {...string} allowedRoles roles permitidos en el sistema
 * @returns {function} middleware de express
 * 
 */

const checkRole = (...allowedRoles)=>{
    return (req,res,next) =>{
        // validar que el usuario fue autenticado y verifyToken se ejecutó
        // req.userRole es establecido por verifyToken middleware
        if(!req.userRole)
            {
            return res.status(401).json({
                success:false,
                message:'Tolen inválido o expirado'
            })
        }
    }
}