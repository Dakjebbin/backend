import mongoose from "mongoose"

const transactionSchema = mongoose.Schema({
    user: { 
        type: String,
        required: true
     },
  amount: { 
    type: Number, 
    required: true 
},
  type: { 
    type: String, 
    enum: ['Deposit', 'Withdrawal', "Profit"], 
    required: true 
},
//   transactionHash: { 
//     type: String, 
//     required: true
//  },  // Bitcoin transaction hash
  status: { type: String, 
    enum: ['Pending', 'Completed', 'Failed'], 
    default: 'pending' },
    
    imageUrl: { // Store the Cloudinary URL
      type: String,
     // required: true
    },
}, {
  timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;