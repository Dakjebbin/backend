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
        const {email, profitAmount} = req.body;
        const validatedUser = req.user

        // if (!profitAmount || !isNaN(profitAmount)) {
        //     res.status(400).json({
        //         success:false,
        //         message: "invalid profit amount"
        //     })
        //     return
        // }

        const user = await User.findOneAndUpdate({email}, {profitAmount}, {new: true});

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
            
        }
           
        
        parseInt(user.profit += Number(profitAmount));
        await user.save();
        
        res.status(200).json({
            success: true,
            message: "Profit updated successfully",
            user
        });
    } catch (error) {
        
    }
    
}

const deleteProfit = async (req, res) => {
    
}



export {updateProfit, deleteProfit}