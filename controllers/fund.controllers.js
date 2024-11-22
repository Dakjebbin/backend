import fundModel from "../model/fund.model.js";
import Transaction from "../model/transaction.model.js";


const fundData = async (req, res) => {
   
    try {
            const validUser = req.user;

            const { amount, plan} = req.body;

            if (!validUser) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access"
                });
            }

            if (!amount ||!plan) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide amount, and plan"
                });
            }


            if (amount <= 0) {
                return res.status(400).json({ error: "Invalid amount" });
              }

const fundUser = await fundModel.findOneAndUpdate(
    {email:  validUser.email},
    {amount, plan},
    { new: true, upsert: true }
 );



fundUser.amount += Number(amount);
        await fundUser.save();

        const newTransaction = new Transaction({
            user: validUser.email,  
            amount: amount,
            type: "deposit",  // Mark this as a deposit
        });

        await newTransaction.save();

    if (fundUser) {
        res.status(201).json({
            success: true,
            message: "Fund added and deposit recorded successfully",
            fundUser
        })
    } else {
        res.status(400).json({
            success: false,
            message: "Fund not added successfully"
        })
    }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
}


export { fundData}