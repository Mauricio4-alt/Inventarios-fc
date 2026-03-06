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
const productControllers = require('../controllers/authProductControllers')
const {check} = require('express-validator')
const {verifyToken} = require('../middleware/authJWT')

const {checkRole} = requiere('../middlewares/role')
// Rutas CRUD

const validateProducts =[
    check('name').not().isEmpty().withMessage('el nombre es obligatorio'),
    check('description').not().isEmpty().withMessage('la descripcion es obligatorio'),
]
check('subcategory').not().isEmpty().withMessage('la subcategoria es obligatorio'),

router.post('',
    verifyToken,
    checkRole(['admin','coordinador','auxiliar']),
    validateSubCategory,
    productControllers .createProduct
)
router.get('/',verifyToken,productControllers .getProducts)

router.get('/:id',productControllers.getProductById)

router.put('/:id',
    verifyToken,
    checkRole(['admin','coordinador','auxiliar']),
    productControllers .updateProduct
)
router.delete('/:id',
    verifyToken,
    checkRole('admin'),
    productControllers.deleteProduct
)
module.exports = router;
