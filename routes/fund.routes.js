import express from 'express';
import { fundData } from '../controllers/fund.controllers.js';
import { validateUsers } from '../middlewares/validate.users.js';
import { userActive } from '../middlewares/uservalid.check.js';

const router = express.Router();

router.post("/fund", validateUsers, userActive, fundData)

export default router