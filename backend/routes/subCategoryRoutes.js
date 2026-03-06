/**
 * Rutas de subCategorias
 * define los endpoints CRUD para la gestion de categorias
 * Las suvcategorias son contenedores padres de productos
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
const subCategoryController = require('../controllers/subCategoryControllers')
const {check} = require('express-validator')
const {verifyToken} = require('../middleware/authJWT')

const {checkRole} = requiere('../middlewares/role')
// Rutas CRUD

const validateSubCategory =[
    check('name').not().isEmpty().withMessage('el nombre es obligatorio'),
    check('description').not().isEmpty().withMessage('la descripcion es obligatorio'),
    check('category').not().isEmpty().withMessage('la categoria es obligatorio'),
]

router.post('',
    verifyToken,
    checkRole(['admin','coordinador']),
    validateSubCategory,
    subCategoryController.createSubcategory
)
router.get('/',subCategoryController.getSubcategories)

router.get('/:id',subCategoryController.getSubcategoryById)

router.put('/:id',
    verifyToken,
    checkRole(['admin','coordinador']),
    subCategoryController.updateCatery
)
router.delete('/:id',
    verifyToken,
    checkRole('admin'),
    subCategoryController.deleteSubcategory
)
module.exports = router;
