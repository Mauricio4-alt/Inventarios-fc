/**
 * Controlador de estadisticas
 * get /api/statistics
 * Ath Bearer token requerido
 * Estadisticas disponibles:
 * total de usuarios
 * total categorias
 * total de subcategorias
*/
 

const Subcategory = require('../models/Subcategory');
const User = require('../models/user');

const Product = require('../models/Products');
const Category = require('../models/Category');
const subCategory = require('../models/Subcategory');


/**
 * respuesta
 * 200 ok stadisticas obtenidas
 * 500 Error de base de datos
 * 
 */

exports.getStatistics = async (req,res) =>{
    try{
        // ejecuta todas las queries en paralelo
        const [totalUsers,totalProducts,totalCategories,totalSubCategories] = await Promise.all([
            User.countDocuments(), // contar usuarios
            Product.countDocuments(), // contar productos
            Category.countDocuments(), // Contar categorias
            subCategory.countDocuments() // contar subcategorias
        ])
         res.status(200).json({
            totalUsers,
            totalProducts,
            totalCategories,
            totalSubCategories
         })
    }catch(err){
        console.error('Error no hay información disponible',err)
        return res.status(500).json({
            success:false,
            message:'Error no hay información disponible',
            error:err.message
        })
        // retornar las estadísticas
       
        
    }
}