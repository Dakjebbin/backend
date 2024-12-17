import User from "../model/user.model.js";
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";




const register = async (req, res) => {
   
   try {
    const register = req.body;
    const {fullname, username, email, phonenumber, password} = register;
    
    if (!fullname || !username  || !email || !phonenumber || !password) {
        res.status(404).json({
            success: false,
            message: "Please provide all fields"
    });
    return;
    }

    //check if email/username exists
    const emailExists = await User.findOne({ email}).exec();
    const userNameExists = await User.findOne({ username }).exec();
    const phoneNumberExists = await User.findOne({ phonenumber }).exec();

    if (emailExists) {
        res.status(409).json({
            success:false,
            message: "Email already in use",
        })
        return;
    }

    if (userNameExists) {
        res.status(409).json({
            success:false,
            message: "Username already exists",
        })
        return;
    }

    if (phoneNumberExists) {
        res.status(409).json({
            success:false,
            message: "Phonenumber already in use",
        })
        return;
    }


    const salt = await bcrypt.genSalt(10)
    const encrypted = await bcrypt.hash(password, salt);

    //using the mongodb model to create user
    const newUser = await User.create({
        fullname,
        username,
        email,
        phonenumber,
        password: encrypted,
       
       
    });

    if (newUser) {
        res.status(201).json({
            success:true,
            message: "created Successfully",
           // user: newUser
        })
    } else {
        res.status(400).json({
            success:false,
            message: "user not created successfully"
        });
    }

   } catch (error) {
        res.status(500).json({
            success:false,
            message: "Internal server error"
        })
   }; 
};

const login = async (req, res) => {
    try {
        const body = req.body;
        

        if (!body.email || !body.password) {
            res.status(400).json({
                success: false,
                message: "Please provide email and password"
            })
            return;
        }

        //check if user exist
        const userExists = await User.findOne({email: body.email}).exec();

        if (!userExists) {
            res.status(404).json({
                success: false,
                message: "invalid credentials"
            });
            return;
        }

        const validPassword = await bcrypt.compare(
            body.password, userExists?.password);

        if(!validPassword) {
            res.status(409).json({
              success:false,
              message: "invalid Credentials"
            });
            return;
          }

// create jwt tokens and cookies

        const accessToken = jwt.sign({
            blood: userExists?._id,
        },
        process.env.AccessTOKEN,
        {
            expiresIn: process.env.accesstime,
        });

        const refreshToken = jwt.sign({
            callofduty: userExists?._id,
        },
        process.env.REFRESHtoken,
        {
            expiresIn: process.env.refreshtime,
        });       

        res.cookie("access_Token", accessToken, {
           httpOnly: true,
           secure: true,
            sameSite:"none",
            maxAge: 30 * 60 * 1000,
        })

        res.cookie("refresh_Token", refreshToken, {
          httpOnly: true,
          secure: true,
            sameSite:"none",
            maxAge: 2 * 60 * 60 * 1000,
        })

          res.status(200).json({
            success: true,
            message: "login successful",
           
          });

    } catch (error) {
        res.status(500).json({
            success:false,
            message: "Internal server error"
        })
    }
    
    
}


// to get all users in admin panel
const userDetails = async (req, res) => {
        try {
            const users = await User.find({}).exec();
            
            if (users?.length === 0) {
                res.status(404).json({
                  success: false,
                  message: "No Users for now",
                });
                return;
              }

            res.status(200).json({
                success: true,
                message: "User details fetched successfully",
                users: users
            })
        } catch (error) {
            res.status(500).json({
                 success: false,
                message: "Internal server error"
            }
               
            )
        }

}

// to get user by id for frontend purposes
const userDetail = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id).exec();
        
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        } 

        res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            user: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
          });
    }
}


const validate = async (req, res) => {

const validuser = req.user;

    
  if (validuser) {
    res.status(200).json({
      success: true,
      message: "User valid",
      user: validuser,
    });
  } else {
    res.status(403).json({
      success: false,
      message: "Session expired",
    });
  }
}

const updateActiveStatus = async (req, res) => {
       
    const { id } = req.params;
    const { status } = req.body;
    try {
            if (!status) {
                res.status(400).json({
                    success: false,
                    message: "Please provide status"
                });
                return;
            }

            const validStatuses = ['active', 'blocked']; // Add other valid statuses if needed
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid status. Allowed statuses are: ${validStatuses.join(', ')}`
                });
            }

       const statusActive = await User.findByIdAndUpdate(
        id,
        {status},
         { new: true }
        ).exec()

             
        if (!statusActive) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        } 

            
                res.status(201).json({
                    success: true,
                    message: "User status updated successfully",
                    statusActive
                });
            
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error" + error.message,
              });
        }


}

const logout = async (req, res) => {

        try {
            res.clearCookie("access_Token", {
                httpOnly: true,
                secure: true,
                 sameSite:"none",
        })
        res.clearCookie("refresh_Token", {
            httpOnly: true,
            secure: true,
             sameSite:"none",
        })
    
        return res.status(200).json({
            success: true,
            message: "logout successful",
          });
    
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error",
              });
        }
   }

const forgotPassword = async (req, res) => {
    const {email} = req.body;

    if (!email) {
        res.status(404).json({
            success: false,
            message: "Please provide email",
        })
        return;
    }

    try {
        const user = await User.findOne({email}).exec();
        if (!user) {
           res.status(404).json({
            success: false,
            message: "User not found",
           }) 
           return;
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15  * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Reset Password",
            text: 
            `
            Hello ${user.username}!
            Your OTP for reset password is: ${otp}. Use this OTP
            in resetting your password

            If you did not request this password reset, please ignore this email.

            Do not reply this Email
            `,
        }
        await transporter.sendMail(mailOption);
    
        
        return res.status(200).json({
            success: true,
            message: "Otp sent to your email",
          
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error " + error.message,
          });  
    }
}

//Validate Otp
const validateOtp = async (res, req) => {
    const {email, otp} = req.body;

    try {
        const user = await User.findOne(email);

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            })
            return;
        }

        if(!user.resetOtp|| user.resetOtp !== otp ){
            res.status(401).json({
                success: false,
                message: "Invalid OTP",
            })
            return;
        }

        if(user.resetOtpExpireAt < Date.now()) {
            res.status(401).json({
                success: false,
                message: "OTP expired",
            })
            return;
        }

        res.status(200).json({
            success:true,
            message: "OTP Verified",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error " + error.message,
          }); 
    }
}

//reset password
    const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;
    

    if (!email || !otp || !newPassword) {
        res.status(400).json({
            success: false,
            message: "Please provide email, otp and new password",
        })
        return;
    }
    try {
       
        const user = await User.findOne({email}).exec();
        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found",
            })
            return;
        }

        if(user.resetOtp === ""|| user.resetOtp !== otp){
            res.status(401).json({
                success: false,
                message: "Invalid OTP",
            })
            return;
        }

        if(user.resetOtpExpireAt < Date.now()) {
            res.status(401).json({
                success: false,
                message: "OTP expired",
            })
            return;
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
   
        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.resetOtpExpireAt = undefined;

        await user.save();
        
        return res.status(200).json({
            success: true,
            message: "Password reset successful",
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
          });
    }
    

   
}
export {register, login, userDetails, userDetail, validate, updateActiveStatus, logout, forgotPassword, validateOtp, resetPassword}