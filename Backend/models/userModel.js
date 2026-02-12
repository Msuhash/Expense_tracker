import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    verifyOtp : {
        type : String,
        default : ''
    },
    verifyOtpExpiresAt : {
        type : Number,
        default : 0
    },
    resetOtp : {
        type : String,
        default : ''
    },
    resetOtpExpiresAt : {
        type : Number,
        default : 0
    },
    isAccountVerified : {
        type : Boolean,
        default : false
    }
})

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;