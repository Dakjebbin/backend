import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import authRoutes from "./routes/user.routes.js"
import transactionRoutes from "./routes/transaction.routes.js"
import fundRoutes from "./routes/fund.routes.js"
import cookieParser from 'cookie-parser';
import cors from "cors"

dotenv.config();

const port = process.env.PORT || 7000
const app = express();
const db = process.env.MONGODB_LINK


app.use(express.json({limit:'10mb'}));
app.use(cookieParser());
app.use(cors({
    origin:[ process.env.CLIENT_URL, "http://localhost:5173", "https://wealthwave-delta.vercel.app"],
    credentials: true,
   
}))
app.use("/auth", authRoutes)
app.use("/transactions", transactionRoutes )
app.use("/userFund", fundRoutes)


app.get("/", (req, res) => {
        res.send("API WORKING");
})

mongoose.connect(db).then(() => {
   try {
    console.log("database connected successfully");
    app.listen(port, () => {
        console.log(`listening on PORT:${port}`);
    })
   } catch (error) {
    console.log("database did not connect");
   }   
})



