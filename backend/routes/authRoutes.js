const express = require('express');
const router = express.Router();

const authController = require('../controllers/authControllers');

const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
} = require('../middleware/verify');

const { verifyToken } = require('../middleware/authJWT');
const { checkRole } = require('../middleware/role');


router.post('/signup',
    verifyToken,
    checkRole('admin'),
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
    authController.signup
);

module.exports = router;