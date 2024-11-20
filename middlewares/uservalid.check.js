export const userActive = async (req, res, next) => {
    const validatedUser = req.user;
    if (validatedUser?.status === "active") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "An error occured please contact the admin for help",
      });
    }
  };
  