const express = require('express');
const router = express.Router();

const categoryController = require('../controllers/categoryControllers');
const { verifyToken } = require('../middleware/authJWT');
const { checkRole } = require('../middleware/role');

// CRUD categories
router.post('/',
    verifyToken,
    checkRole('admin','coordinador'),
    categoryController.createCategory
);

router.get('/', categoryController.getCategories);

router.get('/:id', categoryController.getCategoryById);

router.put('/:id',
    verifyToken,
    checkRole('admin','coordinador'),
    categoryController.updateCategory
);

router.delete('/:id',
    verifyToken,
    checkRole('admin'),
    categoryController.deleteCategory
);

module.exports = router;
