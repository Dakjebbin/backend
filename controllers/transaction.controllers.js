import User from "../model/user.model.js";
import Transaction from "../model/transaction.model.js";

// const getUserProfile = async (req, res) => {
//     try {
//         const user = await User.findById(req.userId).populate("transactionHistory");
//         res.status(200).json({
//             success: true,
//             message: "User profile fetched successfully",
//             user: user
//         })
//     } catch (error) {
        
//     }

// }

const updateProfit = async (req, res) => {

    try {
        const {email, profit} = req.body;


        if (isNaN(profit)) {
            return res.status(400).json({
                success: false,
                message: "Invalid profit value"
            });
        }
        
        const profitValue = Number(profit);

        const user = await User.findOneAndUpdate({email}, 
            { $inc: { profit: profitValue } },
             {new: true});

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
            
        }
           
        
        // user.profit = Number(user.profit) + Number(profit);
        await user.save();
        
        res.status(200).json({
            success: true,
            message: "Profit updated successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error
        })
    }
    
}

const deleteProfit = async (req, res) => {
    
}



export {updateProfit, deleteProfit}