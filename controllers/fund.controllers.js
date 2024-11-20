import fundModel from "../model/fund.model.js";


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

const fundUser = await fundModel.findOneAndUpdate({
    email:  validUser.email,
    amount,
    plan,
    
})



parseInt(fundUser.amount += Number(amount));
        await fundUser.save();

    if (fundUser) {
        res.status(201).json({
            success: true,
            message: "Fund added successfully",
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