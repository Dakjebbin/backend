import express from 'express';
import { login, register, updateActiveStatus, userDetail, userDetails, validate } from '../controllers/user.controllers.js';
import { validateUsers } from '../middlewares/validate.users.js';
import { rolevalidation } from '../middlewares/role.validation.js';

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/users", validateUsers,rolevalidation, userDetails )
router.get("/users/:id", validateUsers, userDetail )
router.get("/validate", validateUsers, validate)
router.patch("/status/:id", validateUsers, rolevalidation, updateActiveStatus)

export default router