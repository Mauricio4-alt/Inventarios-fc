const express = require('express');
const router = express.Router();

const subcategoryController = require('../controllers/subcategoryControllers');
const { verifyToken } = require('../middleware/authJWT');
const { checkRole } = require('../middleware/role');
const { check } = require('express-validator');

const validateSubcategory = [
  check('name').notEmpty().withMessage('El nombre es obligatorio'),
  check('description').notEmpty().withMessage('La descripción es obligatoria'),
  check('category').notEmpty().withMessage('La categoria es obligatoria')
];

// CRUD subcategories
router.post('/',
  verifyToken,
  checkRole('admin','coordinador'),
  validateSubcategory,
  subcategoryController.createSubcategory
);

router.get('/', subcategoryController.getSubcategories);
router.get('/:id', subcategoryController.getSubcategoryById);

router.put('/:id',
  verifyToken,
  checkRole('admin','coordinador'),
  subcategoryController.updateSubcategory
);

router.delete('/:id',
  verifyToken,
  checkRole('admin'),
  subcategoryController.deleteSubcategory
);

module.exports = router;
