import express from 'express';
import { validateUsers } from '../middlewares/validate.users.js';
import { rolevalidation } from '../middlewares/role.validation.js';
import {  getTransactions, imageUpload, updateProfit } from '../controllers/transaction.controllers.js';

const router = express.Router();


router.post("/profits", validateUsers, rolevalidation, updateProfit)
//router.delete("/profits", validateUsers, rolevalidation, deleteProfit)
router.get("/get-transaction/:email", validateUsers, getTransactions)
router.post("/image-Upload", validateUsers, imageUpload)

export default router