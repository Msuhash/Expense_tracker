import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const userData = async (req, res) =>{

    const userId = req.user?.id;

    if(!userId){
        return res.json({success: false, message: "user id invalid"})
    }

    try{

        const user = await User.findById(userId);

        if(!user){
            return res.json({success: false, message: "user not found"});
        }

        return res.json({
            success: true,
            UserData: {
                name: user.username,
                isAuthenticated: user.isAccountVerified,
                email: user.email
            }
        })

    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}

export const updateUsername = async (req, res) => {
    const userId = req.user?.id;
    const {username} = req.body;

    if(!userId){
        return res.json({success: false, message: "user id invalid"})
    }

    const userNameTrimmed = username.trim();

    if(!userNameTrimmed){
        return res.json({success: false, message: "username is required"})
    }

    if(userNameTrimmed.length < 3){
        return res.json({success: false, message: "username must be at least 3 characters long"})
    }

    try{
        const existingUser = await User.findOne({
            username: userNameTrimmed,
            _id: { $ne: userId }
        });
        if(existingUser){
            return res.json({success: false, message: "username already exists"})
        }

        const user = await User.findByIdAndUpdate(userId,{
            username: userNameTrimmed
        }, {new: true});

        if(!user){
            return res.json({success: false, message: "user not found"})
        }

        return res.json({success: true, message: "username updated successfully"})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}

export const updatePassword = async (req,res) => {
    const userId = req.user?.id;
    const { currentpassword, newPassword, confirmPassword} = req.body;

    if(!userId){
        return res.json({success: false, message: "user id invalid"})
    }

    if(!currentpassword || !newPassword || !confirmPassword){
        return res.json({success: false, message: "all fields are required"})
    }

    if(newPassword !== confirmPassword){
        return res.json({success: false, message: "passwords do not match"})
    }

    if(newPassword.length < 6){
        return res.json({success: false, message: "password must be at least 6 characters long"})
    }

    try{
        const user = await User.findById(userId);
        if(!user){
            return res.json({success: false, message: "user not found"})
        }

        const isMatch = await bcrypt.compare(currentpassword, user.password);
        if(!isMatch){
            return res.json({success: false, message: "incorrect current password"})
        }

        if (await bcrypt.compare(newPassword, user.password)) {
            return res.json({success: false, message: "New password cannot be same as old password"});
        }

        const hashedpassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedpassword;
        await user.save();

        return res.json({success: true, message: "password updated successfully"})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}

export const logout = async (req, res) => {

    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ success: true, message: "logged out" })

    }
    catch (error) {
        return res.json({ success: false, message: error.message })
    }

}