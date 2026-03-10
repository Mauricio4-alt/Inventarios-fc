const express = require('express');
const router = express.Router();

const productController = require('../controllers/authProductControllers');
const { verifyToken } = require('../middleware/authJWT');
const { checkRole } = require('../middleware/role');
const { check } = require('express-validator');

const validateProduct = [
  check('name').notEmpty().withMessage('El nombre es obligatorio'),
  check('description').notEmpty().withMessage('La descripción es obligatoria'),
  check('price').isNumeric().withMessage('Precio debe ser numérico'),
  check('stock').isInt({ min: 0 }).withMessage('Stock debe ser entero no negativo'),
  check('category').notEmpty().withMessage('Categoria es obligatoria'),
  check('subcategory').notEmpty().withMessage('Subcategoria es obligatoria')
];

// endpoints
router.post('/',
  verifyToken,
  checkRole('admin','coordinador','auxiliar'),
  validateProduct,
  productController.createProduct
);

router.get('/', verifyToken, productController.getProducts);
router.get('/:id', productController.getProductById);

router.put('/:id',
  verifyToken,
  checkRole('admin','coordinador','auxiliar'),
  productController.updateProduct
);

router.delete('/:id',
  verifyToken,
  checkRole('admin'),
  productController.deleteProduct
);

module.exports = router;
