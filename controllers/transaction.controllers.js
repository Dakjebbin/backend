import User from "../model/user.model.js";
import Transaction from "../model/transaction.model.js";
import cloudinary from "../utils/cloudinary.js";
import multer from "multer";

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
           
        
        const newTransaction = new Transaction({
            user: email,  
            amount: profit,
            type: "Profit", 
            status: "Completed" // Mark this as a deposit
        });
        // user.profit = Number(user.profit) + Number(profit);
        await user.save();
        await newTransaction.save();

        
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



const getTransactions = async (req, res) => {
    const {email} = req.params;
    const user = req.user;

    if (user.email !== email) {
        return res.status(403).json({ success: false, message: 'User not found or unauthorized' });
      }
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }
        try {
            const transactions = await Transaction.find({ user:email })
     .sort({ date: -1 })  // Sort by date (newest first)
      .exec();

      if (transactions.length === 0) {
        return res.status(404).json({ success: false, message: 'No transactions found for this user' });
      }


            res.status(200).json({
                success: true,
                message: "User transactions fetched successfully",
                data: transactions
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error " + error.message 
            })
        }
}


const storage = multer.memoryStorage();  // Store file in memory for uploading to Cloudinary
const upload = multer({ storage: storage });

const imageUpload = async (req, res) => {
    const validUser = req.user;
    // const uploadPreset = 'WealthWaveMain';

    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file uploaded' });
      }

    try {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'payments/proofs',
              public_id: validUser.email,
            }, async (error, result) => {
                if (error) {
                  return res.status(500).json({
                    success: false,
                    message: "Cloudinary upload failed",
                    error: error.message || error,
                  });
                }
          
                // Save the transaction with the image URL
                const newTransaction = new Transaction({
                  user: validUser,
                  imageUrl: result.secure_url,
                });
          
                await newTransaction.save();
          
                // Respond with the secure URL of the uploaded image
                res.status(200).json({
                  success: true,
                  message: "Image uploaded successfully",
                  url: result.secure_url,
                });
              });
          
              // Pass the file buffer to the upload stream
              uploadStream.end(req.file.buffer);
          
            } catch (error) {
              res.status(500).json({
                success: false,
                message: "Internal server error",
                error: error.message || error,
              });
            }
          };




export {updateProfit, getTransactions, imageUpload, upload}