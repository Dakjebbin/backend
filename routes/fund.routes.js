import express from 'express';
import { fundData, getFundData } from '../controllers/fund.controllers.js';
import { validateUsers } from '../middlewares/validate.users.js';
import { userActive } from '../middlewares/uservalid.check.js';

const router = express.Router();

router.post("/fund", validateUsers, userActive, fundData)
router.get("/fund/:email", validateUsers, getFundData)


export default router