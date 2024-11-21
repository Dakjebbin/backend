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
    enum: ['deposit', 'withdrawal'], 
    required: true 
},
//   transactionHash: { 
//     type: String, 
//     required: true
//  },  // Bitcoin transaction hash
  status: { type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' },
}, {
  timestamps: true
})

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;