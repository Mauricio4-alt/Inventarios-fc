/**
 * Rutas de categorias
 * define los endpoints CRUD para la gestion de categorias
 * Las categorias
 * 
 * Post /api/categories crea una nueva categoria
 * Get /api/categories obtiene todas  las categorias
 * Get /api/categories/´_id obitnene una categoria por id 
 * PUT /api/categories/:id actualiza una categoria por id
 * Delete /api/categories/:id elimina una categoria por id
 * 
 * 
 * 
 * 
 */

const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const {checkRole} = requiere('../middlewares/role')
// Rutas CRUD

router.post('',
    verifiToken,
    checkRole(['admin','coordinador']),
    categoryController.createCategory
)

router.get('/',categoryController.getCategories)

router.get('/id',categoryController,gerCategoryById)

router.put('/id',
    verifyToken,
    checkRole(['admin','coordinador']),
    categoryController.updateCatery
)
router.delete('/id',
    verifyToken,
    checkRole('admin'),
    categoryController.deleteCategory
)
module.exports = router;
