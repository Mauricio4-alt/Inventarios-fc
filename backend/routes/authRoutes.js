const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/authControllers');

const {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
} = require('../middleware/verify');

const { verifyToken } = require('../middleware/authJWT');
const { checkRole } = require('../middleware/role');

router.post('/sigin',authControllers.signin);

router.post('/signup',
    verifyToken,
    checkRole('admin'),
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
    authControllers.signup
);

module.exports = router;