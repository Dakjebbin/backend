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

              if (req.body.email !== validUser.email) {
                return res.status(403).json({
                    success: false,
                    message: "Email does not match authenticated user"
                });
            }

const fundUser = await fundModel.findOneAndUpdate(
    {email:  validUser.email},
    { $inc: { amount: amount }, plan },
    { new: true, upsert: true }
 );

        await fundUser.save();

        const newTransaction = new Transaction({
            user: validUser.email,  
            amount,
            type: "Deposit",  // Mark this as a deposit
             status: "Pending"
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

const getFundData = async (req , res) => {
        const {email} = req.params;
        const validUser = req.user;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email parameter is required' });
        }

        if (validUser.email !== email) {
            return res.status(403).json({ success: false, message: 'User not found or unauthorized' });
          }

          try {
            const user = await fundModel.findOne({email}).exec();

            res.status(200).json({ success: true, 
                message: "fund data fetched",
                user
            });

          } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error " + error.message 
            })
          }
}



export { fundData, getFundData}