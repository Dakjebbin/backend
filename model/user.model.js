import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "Please enter your Fullname"],
    },
    username: {
        type: String,
        required: [true, "Please enter your Username"],
        unique: true,
    },
    // Dateofbirth: {
    //     type: Date,
    //     required: [true, "Please enter your Date of Birth"],
    // },
    email:{
        type: String,
        required: [true, "Please enter your Email"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid Email"]
    }, 
    phonenumber:{
        type: String,
        required: [true, "Please enter your Phone Number"],
        unique: true,
    }, 
    password: {
        type: String,
        required: [true, "Please enter your Password"],
    }, 
    
    // country:{
    //     type: String,
    //     required: [true, "Please enter your Country"],
    // },
    // balance: { 
    //     type: Number, 
    //     default: 0 
    // },
     profit: { 
         type: Number, 
         default: 0 
     },
    status: { 
        type: String, 
        enum: ['active', 'blocked'], 
        default: 'active' },
        
        // transactionHistory: [{
        //     amount: Number,
        //     date: { type: Date, default: Date.now },
        //     type: { type: String, enum: ['deposit', 'withdrawal', 'profit'], required: true }
        // }],
        
        investmentPlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InvestmentPlan'
        },
        isAdmin: { 
            type: String, 
            default: "USER" 
        },
    
},{
    timestamps: true,
})

const User = mongoose.model("User", UserSchema);

export default User;