import express from 'express';
import { validateUsers } from '../middlewares/validate.users.js';
import { rolevalidation } from '../middlewares/role.validation.js';
import { deleteProfit, updateProfit } from '../controllers/transaction.controllers.js';

const router = express.Router();


router.post("/profits", validateUsers, rolevalidation, updateProfit)
router.delete("/profits", validateUsers, rolevalidation, deleteProfit)

export default router