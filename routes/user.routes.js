import express from 'express';
import { 
    forgotPassword,
    login, 
    logout, 
    register, 
    resetPassword,
    updateActiveStatus,
    userDetail, 
    userDetails, 
    validate, 
    validateOtp} from '../controllers/user.controllers.js';
import { validateUsers } from '../middlewares/validate.users.js';
import { rolevalidation } from '../middlewares/role.validation.js';

const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.get("/users", validateUsers,rolevalidation, userDetails )
//router.get("/users/:id", validateUsers, userDetail )
router.get("/validate", validateUsers, validate)
router.patch("/status/:id", validateUsers, rolevalidation, updateActiveStatus)
router.post("/logout", validateUsers, logout)
router.post("/forgot-Password", forgotPassword)
router.post("/validate-Otp", validateOtp)
router.post("/reset-password", resetPassword)


export default router