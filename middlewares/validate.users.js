import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

export const validateUsers = async (req, res, next) => {
    const accesstoken = req.cookies.access_Token;
    const refreshtoken = req.cookies.refresh_Token;

    console.log("the token i set",{accesstoken, refreshtoken});
    // Implement your token validation logic here

    if(!accesstoken) {
        if(!refreshtoken) {
           return res.status(403).json({
                success: false,
                message: "Session expired"
            });
        } else {
            jwt.verify(refreshtoken, process.env.REFRESHtoken, async (err, decoded) => {
                if(err) {
                    return res.status(403).json({
                        success: false,
                        message: "Session expired"
                    });
                } else {
                    const validuser = await User.findById(decoded.callofduty).exec();

                    if(!validuser) {
                        res.status(403).json({
                            success: false,
                            message: "not found"
                        });
                        return;
                    }
                    console.log("the valid user => ", validuser);
                    const accesstoken = jwt.sign({
                        blood: validuser?._id
                    },
                    process.env.AccessTOKEN,
                    {
                        expiresIn: process.env.accesstime
                    }
                );

                res.cookie("access_Token", accesstoken, {
                  httpOnly: true,
                  secure: true,
                     sameSite:"none",
                     maxAge: 40 * 1000,
                 })
                  const { password, ...rest } = validuser._doc;

                    req.user = rest;

            next();
                }
            })

            
         
        }
    } else {
            jwt.verify(accesstoken, process.env.AccessTOKEN, async (err, decoded) => {
                    if (err) {
                        return res.status(403).json({
                            success: false,
                            message: "Session expired"
                        });
                    } else {
                            const validuser = await User.findById(decoded.blood).exec();

                            if (!validuser) {
                                    res.status(404).json({
                                        success: false,
                                        message: "not found"
                                    })
                                    return;
                            }

                            
          const { password, ...rest } = validuser._doc;

          req.user = rest;
                            next()
                    }
            })
    }
   
};




