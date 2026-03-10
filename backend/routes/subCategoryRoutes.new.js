const express = require('express');
const router = express.Router();

const subCategoryController = require('../controllers/subCategoryControllers');
const { verifyToken } = require('../middleware/authJWT');
const { checkRole } = require('../middleware/role');
const { check } = require('express-validator');

const validateSubCategory = [
  check('name').notEmpty().withMessage('El nombre es obligatorio'),
  check('description').notEmpty().withMessage('La descripción es obligatoria'),
  check('category').notEmpty().withMessage('La categoria es obligatoria')
];

// CRUD subcategories
router.post('/',
  verifyToken,
  checkRole('admin','coordinador'),
  validateSubCategory,
  subCategoryController.createSubcategory
);

router.get('/', subCategoryController.getSubcategories);
router.get('/:id', subCategoryController.getSubcategoryById);

router.put('/:id',
  verifyToken,
  checkRole('admin','coordinador'),
  subCategoryController.updateSubcategory
);

router.delete('/:id',
  verifyToken,
  checkRole('admin'),
  subCategoryController.deleteSubcategory
);

module.exports = router;
